---
title: "Hardware Accelerated Real-Time Vulkan Pathtracing"
slug: ""
summary: "An exploration of full pathtraced raytracing with various techinques"
publishedDate: 2025-06-18
status: "active"
tags:
  - "Vulkan"
  - "Shaders"
  - "Raytracing"
  - "Denoising"
coverImage: "https://i.imgur.com/3IfqdWY.png"
featured: true
homepageWeight: 2
links: []
---
## Real-Time with Denoising

---------------

<iframe
  width="100%"
  height="560"
  src="https://www.youtube.com/embed/3-y47EdmThA"
  title="Hardware Accelerated Real-Time Vulkan Pathtracing Demo"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>

This was a project to learn both Vulkan as a framework and how to setup full pathtracing with techniques to make it almost viable in real-time.

## For the Non-techinical

Path tracing is a graphics rendering technique that creates very realistic images by simulating the way light behaves in the real world. Instead of using shortcuts to fake lighting, it tracks how light can bounce off different surfaces and eventually reach the camera, which allows it to naturally produce effects like soft shadows, reflections, indirect lighting, and more believable materials such as glass or metal. In simple terms, it is a way of teaching the computer to light a 3D scene more like real life, which is why it can make images look much more natural and cinematic, though it also requires significantly more computing power than simpler rendering methods.

## Things Implimented

1. The entire Vulkan Render Pipline for SDK 1.4
2. Montie-Carlo pathtracing algorithem
3. Pixel Accumulation
4. History Tracking

## Future Plans

1. **More Robust Vulkan** 
   - The implimentation I went for was very rudimentry many features like window resizing and less hard coded systems & buffers are missing.
   - **Atmospheric deffusion** where the light is scattered subtlely by the atmosphere itself, Not useful for this indoor test scene but something important in the future.
   - Deffered shading path: a more traditional raster approach.
   - Shader Graphs: A visual way to create shader materials.
2. **Specular Lighting & denoising** beause the rudimentry denoising I did is a procedural algorithem it can't handle full lighting. Specular & highly reflective surfaces break it and thus it is not part of the the denoised scene. To add it back in, I need to add another path where high specular objects are computed separately. Then we can merge them back into the original image
3. **ML/AI based denoising** as I have delved into pytorch in recent years, I think it would be some one easy to set up a training loop where I get fully accumulated images of scenes along with images that only have 1 pass. Being able to get a decent model as well as one that is fast at the end of they day is an interesting engineering puzzle.

## Coding Examples

### The Montie Carlo Path-Tracing loop

*Inside of a `.rgen` `glsl` shader*

```glsl
    // Path tracing loop
    for (int i = 0; i < pcRay.depth; i++) {
        payload.hit = false;

        // Fire the ray
        traceRayEXT(topLevelAS,           // acceleration structure
                    gl_RayFlagsOpaqueEXT, // rayFlags
                    0xFF,                 // cullMask
                    0,                    // sbtRecordOffset
                    0,                    // sbtRecordStride
                    0,                    // missIndex
                    rayOrigin,            // ray origin
                    0.001,                // ray min range
                    rayDirection,         // ray direction
                    10000.0,              // ray max range
                    0                     // payload location
                    );
        
        // If nothing was hit
        if (!payload.hit) {
            // Debug: Add a sky color or environment light
            C += vec3(0.5, 0.7, 0.9) * W;
            break;
        }

        // Get hit object data
        Material mat;
        vec3 nrm;
        GetHitObjectData(mat, nrm);

        // Light emission
        if (dot(mat.emission, mat.emission) > 0.0) {
            C += W * mat.emission* pcRay.exposure;
            debugColor = mat.emission;
            break;
        }

        // First hit data collection
        if (i == 0) {
            firstPos = payload.hitPos;
            firstDepth = payload.hitDist;
            firstNrm = nrm;
            firstKd = mat.diffuse;
            debugColor = mat.diffuse;
            firstHit = payload.hit;
        }

        // BRDF sampling and evaluation
        vec3 N = normalize(nrm);
        vec3 Wi = SampleBrdf(payload.seed, N);
        vec3 Wo = -rayDirection;

        vec3 f = EvalBRDF(N, Wi, Wo, mat);
        float p = PdfBrdf(N, Wi) * pcRay.rr;

        // Debug: Force some minimum contribution
        if (p < 1e-6) {
            C += W * mat.diffuse * 0.1;
            break;
        }

        W *= f / p;
        rayOrigin = payload.hitPos;
        rayDirection = Wi;
    }

```

- Each iteration = one path bounce:
  - `traceRayEXT(...)` intersects the scene (or misses).
  - On hit: `GetHitObjectData(...)` loads material + normal.
  - A random outgoing direction is sampled via `SampleBrdf(...)` (this is the MC sampling).
  - The BRDF is evaluated with `EvalBRDF(...)` and its PDF with `PdfBrdf(...)`.
  - Throughput `W` is updated by multiplying by `f / p` (path contribution weighting).
  - Ray origin/direction are advanced to continue the path.

- Termination conditions inside the loop:
  - Miss => add environment light (`C += sky * W`) and break.
  - Hit an emissive surface => accumulate emission and break.
  - Low PDF / numerical guard => break (your code has `if (p < 1e-6)`).
  - Loop count limit `pcRay.depth` (max bounces).

### History & Accumulation

```glsl
    // History reconstruction
    vec4 P;
    if (!firstHit) {
        P = vec4(debugColor, 1.0);
    } else {
        // Back-project the current frame's world position
        vec4 screenH = (mats.priorViewProj * vec4(firstPos, 1.0));
        vec2 screen = ((screenH.xy / screenH.w) + vec2(1.0)) / 2.0;

        // Projection outside screen
        if (screen.x < 0.0 || screen.x > 1.0 || screen.y < 0.0 || screen.y > 1.0) {
            P = vec4(debugColor, 1.0);
        } else {
            // Calculate pixel location and offsets
            vec2 floc = screen * gl_LaunchSizeEXT.xy - vec2(0.5);
            vec2 offset = fract(floc);
            ivec2 iloc = ivec2(floc);

            // Bilinear weights
            float b[4] = float[4](
                (1.0 - offset.x) * (1.0 - offset.y),  // b0,0
                (1.0 - offset.x) * offset.y,          // b0,1
                offset.x * (1.0 - offset.y),          // b1,0
                offset.x * offset.y                   // b1,1
            );

            float totalWeight = 0.0;
            vec3 weightedSum = vec3(0.0);
            float weightedN = 0.0;

            // Loop over the 4 neighboring pixels
            for (int i = 0; i <= 1; i++) {
                for (int j = 0; j <= 1; j++) {
                    vec4 prevPixel = imageLoad(colPrev, iloc + ivec2(i, j));
                    vec4 prevNd = imageLoad(ndPrev, iloc + ivec2(i, j));
                    
                    float depthWeight = (abs(firstDepth - prevNd.w) < dthreshold) ? 1.0 : 0.0;
                    float normalWeight = (dot(firstNrm, prevNd.xyz) > nthreshold) ? 1.0 : 0.0;

                    float weight = b[i*2 + j] * depthWeight * normalWeight;
                    
                    weightedSum += prevPixel.xyz * weight;
                    weightedN += prevPixel.w * weight;
                    totalWeight += weight;
                }
            }

            // No valid pixels to average
            P = (totalWeight <= 0.0) 
                ? vec4(debugColor, 1.0)
                : vec4(weightedSum / totalWeight, weightedN / totalWeight);
        }
    }

    // Accumulate current frame's value
    // Adaptive accumulation
    float blendFactor = 1.0 / (P.w + 1.0);
    vec3 newAve = P.xyz + (C - P.xyz) * blendFactor;
    float newN = P.w + 1.0;

    // Write to current frame's output
    imageStore(colCurr, ivec2(gl_LaunchIDEXT.xy), vec4(newAve, newN));
    imageStore(kdCurr, ivec2(gl_LaunchIDEXT.xy), vec4(firstKd, 0));
    imageStore(ndCurr, ivec2(gl_LaunchIDEXT.xy), vec4(firstNrm, firstDepth));
```
**History / temporal reconstruction:**

- If no `firstHit` => use debugColor
- Otherwise backproject firstPos using mats.priorViewProj into previous frame UVs.
- If backprojection outside screen => use debugColor.
- Else sample 4 neighbor pixels from colPrev / ndPrev, compute bilinear weights and apply depth/normal checks (dthreshold, nthreshold) to build a weighted previous color P.

In more layman terms: figure out if we have information on this pixel based on where it's hit comes from and then use those old values in the average color of the pixel as we shoot more rays into the scene. 
