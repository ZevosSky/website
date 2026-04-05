---
title: "Command Pattern Based Animations/Systems"
slug: "command-pattern-based-animations-systems"
summary: "A systems-oriented prototype showing how the command pattern can drive animations, sequences, and reusable gameplay-style behaviors."
publishedDate: 2025-08-05
status: "completed"
tags:
  - "Architecture"
  - "Animation Systems"
  - "Gameplay Programing"
  - "Unity"
coverImage: "https://i.imgur.com/meAoCry.gif"
featured: true
homepageWeight: 3
links: []
---

# Summary

-------

This is a Unity project exploring the Action List design pattern. It provides a high degree of modular control over selected objects, entities, and other gameplay elements, and it taught me a great deal about animation systems.

## Features

- Generic actions that can be applied to any object with a transform to animate movement, and UI effects.
- **Multi Chanel system:** actions can launched on seperate chanels so various actions can happen independant of each other or sequentally 
- Full Easing Suite whever you may need them 
- Function Call backs and Similtanious transforms for smooth sequences of animations
- debug output if needed

## Code Samples

-----

**The action list class that takes a base class of action list**

```cs
  public class ActionManager : MonoBehaviour
  {
      private Queue<ActionBase> actionQueue = new Queue<ActionBase>();
      private List<ActionBase> activeActions = new List<ActionBase>();
      private bool islistBlocked = false;
      public float globalTimeScale = 1f;
      
      [SerializeField] private TextMeshProUGUI debugText; // Debug text for showing active actions  
      [SerializeField] private bool debugMode = false;

      public void ToggleDebugText()
      {
          debugMode = !debugMode;
          if (debugText == null) Debug.LogError("Debug Text is not assigned in the inspector!");
          else debugText.gameObject.SetActive(debugMode);
          
      }

    void Update()
    {
          if (debugMode)
          {
              debugText.text = $"Active Actions: {activeActions.Count}" + "\n";
          }
          // Process active actions
          for (int i = activeActions.Count - 1; i >= 0; i--) 
          {
              var action = activeActions[i];
              
              // If the target GameObject was destroyed, discard the action cleanly
              if (action is GameObjectAction goa && !goa.IsTargetAlive())
              {
                  activeActions.RemoveAt(i);
                  if (action.isBlocking) islistBlocked = false;
                  continue;
              }
              
              if (debugMode) debugText.text += action.GetActionState() + "\n";
          
              // Check if action should start (after delay)
              if (action.UpdateDelay()) action.Update();
          
              if (action.isComplete) 
              {   
                  action.onComplete?.Invoke();                
                  activeActions.RemoveAt(i);
              
                  // Only unblock if this was a blocking action
                  if (action.isBlocking) islistBlocked = false;
              }
          }

          // Add new actions if not blocked
          // Keep adding actions until we hit a blocking one or empty the queue
          while (!islistBlocked && actionQueue.Count > 0)
          {
              ActionBase next = actionQueue.Peek();
              
              // Discard any queued actions whose target has already been destroyed
              if (next is GameObjectAction goaQueued && !goaQueued.IsTargetAlive())
              {
                  actionQueue.Dequeue();
                  if (next.isBlocking) islistBlocked = false; // don't let a dead blocking action stall the queue
                  continue;
              }
              
              ActionBase action = actionQueue.Dequeue();
              activeActions.Add(action);
              action.SetManager(this);
              action.Start();
          
              // If we hit a blocking action, stop adding more until it completes
              if (action.isBlocking) 
              { 
                  islistBlocked = true;
                  break;
              }
          }
      } // End of Update()
      
      public void AddAction(ActionBase action)
      {
          action.SetManager(this);        // action looks at the manager for global time scale
          actionQueue.Enqueue(action);
      }
  } // end of ActionManager
```
To spawn chanels you just spawn an array with more or less action managers!

**The base action class**

```cs
public abstract class ActionBase
{
    public float duration; // total duration of the action
    public float delay;    // delay before starting the action
    public bool isBlocking;// if true, blocks subsequent actions until complete
    public System.Action onComplete;
    public bool isComplete;
    public float timeScale = 1f;
    protected ActionManager manager;             // Reference to manager for global timescale
    protected bool isPartOfSimultaneous = false; // track if the action is part of a simultaneous action

    protected bool hasStarted = false; // track if the action started or not 
    protected float delayTimer = 0.0f; // delay timer 
    protected float elapsed = 0.0f;    // track elapsed time separately from delay
    protected float deltaTime => Time.deltaTime * timeScale * (manager != null ? manager.globalTimeScale : 1f);
    
    public void SetManager(ActionManager manager)
    {
        this.manager = manager;
    }
    
    public void SetSimultaneousFlag(bool isSimultaneous)
    {
        this.isPartOfSimultaneous = isSimultaneous;
    }
    
    public virtual void Start() // IMPORTANT: for the delay to work properly inherited need to call base.Start() 
    {                           //            if they override this class. 
        delayTimer = 0f;
        elapsed = 0f;
        hasStarted = false;
        isComplete = false; // Ensure we reset this when restarting
    }

    public virtual bool UpdateDelay()
    {
        if (hasStarted) return true; // delay is complete, return true
        
        delayTimer += deltaTime;
        
        if (delayTimer >= delay)
        {
            hasStarted = true;
            OnDelayComplete();
            return true;
        }
        return false;
    }

    public virtual void Update()
    {
        if (hasStarted)
        {
            elapsed += deltaTime;
            if (elapsed >= duration)
            {
                isComplete = true;
            }
        }
    }
    protected virtual void OnDelayComplete() { }

    public virtual string GetActionState()
    {
        return $"{GetType().Name} - Duration: {duration}, ElapsedTime: {deltaTime}, Delay: {delay}, " +
               $"ElapsedDelay: {delayTimer} Blocking: {isBlocking} ";
    }

}
```

**Transform actions (SRT)**

```cs
//===| SRT Actions |===================================================|
#region ScaleRotateTranslateActions
// README/IMPORTANT: all these actions are based on absolute world position and rotation, not local 
//                   or relative position and rotation.

public delegate float EaseFunction(float t);

/// <summary>
/// Scale a game object based to a target size
/// </summary>
/// 
public class ScaleAction : GameObjectAction
{
    private Vector3 targetScale;
    private EaseFunction easeFunction;
    
    public Vector3 GetTargetScale() => targetScale;
    public EaseFunction GetEaseFunction() => easeFunction;

    public ScaleAction( GameObject entity,
                        Vector3 targetScale, 
                        float duration, 
                        float delay = 0f, 
                        EaseFunction easeFunction = null,
                        bool blocking = true ) 
        : base(entity)
    {
        this.targetScale = targetScale;
        this.duration = duration;
        this.delay = delay;
        this.isBlocking = blocking;
        this.easeFunction = easeFunction ?? Easing.Linear;
    }
    
    public override void Start()
    {
        base.Start();
        
        if (!isPartOfSimultaneous)
        {
            onComplete = () => targetObject.transform.localScale = targetScale;
        }
    }


    public override void Update()
    {
        base.Update(); // Call base update to handle elapsed time and completion
        
        // Only update if we've passed the delay
        if (!hasStarted) return;
        
        // Use elapsed from base class
        float t = Mathf.Clamp01(elapsed / duration);
        float easedT = easeFunction(t);
        
        if (t >= 1.0f)
        {
            targetObject.transform.localScale = targetScale; // Ensure we reach exactly the target
            return;
        }

        // Use startScale from the base class
        targetObject.transform.localScale = Vector3.LerpUnclamped(startScale, targetScale, easedT);
    }
} // end of ScaleAction


/// <summary>
/// Translate a game object to a target position with optional easing, duration, and delay
/// </summary>
public class TranslateAction : GameObjectAction
{
    
    private Vector3 targetPos;
    private EaseFunction easeFunction;
    
    public Vector3 GetTargetPosition() => targetPos;
    public EaseFunction GetEaseFunction() => easeFunction;
    
    // Constructor to create a TranslateAction
    public TranslateAction(GameObject entity, Vector3 target, float duration, float delay = 0f, EaseFunction easeFunction = null, bool blocking = true) 
        : base(entity)
    {
        this.targetPos = target;
        this.duration = duration;
        this.delay = delay;
        this.isBlocking = blocking;
        this.easeFunction = easeFunction ?? Easing.Linear;
    }
    public override void Start()
    {
        base.Start();
        
        if (!isPartOfSimultaneous)
        {
            onComplete = () => targetObject.transform.position = targetPos;
        }
    }
    public override void Update()
    {
        base.Update();
        
        if (!hasStarted) return;
        
        float t = Mathf.Clamp01(elapsed / duration);
        float easedT = easeFunction(t);
        
        if (t >= 1.0f)
        {
            targetObject.transform.position = targetPos;
            return;
        }

        // Use startPosition from the base class
        targetObject.transform.position = Vector3.LerpUnclamped(startPosition, targetPos, easedT);
    }
} // end of TranslateAction

/// <summary>
/// Specify a target rotation for a game object
/// NOTE: this is an absolute rotation, not a relative rotation this is the target rotation
/// </summary>
public class RotateAction : GameObjectAction
{
    private Quaternion targetRotation;
    private EaseFunction easeFunction;
    private Vector3 targetEulerAngles;
    
    public Vector3 GetTargetRotation() => targetEulerAngles;
    public EaseFunction GetEaseFunction() => easeFunction;

    public RotateAction( GameObject entity,
                         Vector3 targetEulerAngles, 
                         float duration, 
                         float delay = 0f, 
                         EaseFunction easeFunction = null, 
                         bool blocking = true ) 
        : base(entity)
    {
        this.targetEulerAngles = targetEulerAngles;     
        this.targetRotation = Quaternion.Euler(targetEulerAngles);
        this.duration = duration;
        this.delay = delay;
        this.isBlocking = blocking;
        this.easeFunction = easeFunction ?? Easing.Linear;
    }
    
    public override void Start()
    {
        base.Start();
        
        if (!isPartOfSimultaneous)
        {
            onComplete = () => targetObject.transform.rotation = targetRotation;
        }
    }

    public override void Update()
    {
        base.Update(); // Call base update to handle elapsed time and completion
        
        // Only update if we've passed the delay
        if (!hasStarted) return;
        
        // Use elapsed from base class - NOT incrementing here
        float t = Mathf.Clamp01(elapsed / duration);
        float easedT = easeFunction(t);
        
        if (t >= 1.0f)
        {
            targetObject.transform.rotation = targetRotation; // Ensure we reach exactly the target
            return;
        }

        targetObject.transform.rotation = Quaternion.LerpUnclamped(startRotation, targetRotation, easedT);
    }
    
    
}
```

**The entire code for animating and shuffling a deck**

```cs
    void ShuffleDeck(List<GameObject> deck, Transform transform, Vector3 deckSpacing)
    {
        // first shuffle their orders in the deck data structure
        deck.Shuffle(); // Fisher-Yates shuffle algorithm lifted from somewhere on the internet
        
        // now animate them to their correct positiions
        Vector3 deckLocation = transform.position;
        Quaternion deckRotation = transform.rotation;
        for (int i = 0; i < deck.Count; ++i)
        {
            int direction = Random.Range(0, 2);
            const float shuffleOffset = 0.5f;
            // First movement - to side (non-blocking)
            actionManager.AddAction(new TranslateAction(
                deck[i],
                new Vector3(
                    deckLocation.x + (direction == 0 ? shuffleOffset : -shuffleOffset), 
                    deckLocation.y,
                    deckLocation.z
                ),
                0.5f,
                0.0f,
                easeFunction: Easing.EaseOutElastic,
                false // NOT blocking - all cards move at once
            ));
            // then move them to their correct position
            actionManager.AddAction(new TranslateAction(
                deck[i],
                new Vector3(
                    deckLocation.x + deckSpacing.x * i, 
                    deckLocation.y + deckSpacing.y * i,
                    deckLocation.z + deckSpacing.z * i
                ),
                0.7f,
                0.7f + (0.01f * i), // Delay
                easeFunction: Easing.EaseOutElastic,
                false // NOT blocking - all cards move at once
            ));

        } // end for loop
        actionManager.AddAction(new BlockAction(2.45f));
    }
```

If you are interested in more feel free to contact me about it!
