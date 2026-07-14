import asyncio
import websockets
import json
import sys

async def run_cdp():
    ws_url = "ws://127.0.0.1:9222/devtools/page/CA1AA8739C7A1320155914DE1274B72C"
    print(f"Connecting to CDP at {ws_url}...")
    
    async with websockets.connect(ws_url) as ws:
        # Enable console and runtime domains
        await ws.send(json.dumps({"id": 1, "method": "Runtime.enable"}))
        await ws.send(json.dumps({"id": 2, "method": "Log.enable"}))
        
        # Helper to execute expression
        async def evaluate(expr):
            req_id = 100 + hash(expr) % 1000
            await ws.send(json.dumps({
                "id": req_id,
                "method": "Runtime.evaluate",
                "params": {
                    "expression": expr,
                    "returnByValue": True
                }
            }))
            
            # Wait for response
            while True:
                resp = await ws.recv()
                data = json.loads(resp)
                if data.get("id") == req_id:
                    result = data.get("result", {}).get("result", {})
                    if "exceptionDetails" in data.get("result", {}):
                        print(f"Error evaluating '{expr}':", data["result"]["exceptionDetails"])
                        return None
                    return result.get("value")
        
        print("\n--- 1. Checking window variables ---")
        
        schema_version = await evaluate("window.currentLessonUI ? window.currentLessonUI.schemaVersion : null")
        print("schemaVersion:", schema_version)
        
        has_overview = await evaluate("window.currentLessonUI && window.currentLessonUI.project ? true : false")
        print("has overview/project:", has_overview)
        
        beginner_keys = await evaluate("window.currentLessonUI && window.currentLessonUI.beginner ? Object.keys(window.currentLessonUI.beginner) : []")
        print("beginner keys:", beginner_keys)
        
        intermediate_keys = await evaluate("window.currentLessonUI && window.currentLessonUI.intermediate ? Object.keys(window.currentLessonUI.intermediate) : []")
        print("intermediate keys:", intermediate_keys)

        print("\n--- 2. Checking DOM elements status & innerHTML ---")
        containers = [
            "overviewContainer",
            "beginnerContainer",
            "intermediateContainer",
            "expertContainer",
            "projectContainer",
            "assessmentContainer",
            "cheatsheetContainer",
            "interviewContainer",
            "revisionContainer"
        ]
        
        for c in containers:
            status = await evaluate(f"""
                (() => {{
                    const el = document.getElementById('{c}');
                    if (!el) return 'missing';
                    const style = window.getComputedStyle(el);
                    // Also check its closest parent tab-panel style since the parent is hidden by default
                    const parent = el.closest('.tab-panel');
                    const parentStyle = parent ? window.getComputedStyle(parent) : null;
                    return {{
                        exists: true,
                        display: style.display,
                        visibility: style.visibility,
                        parentDisplay: parentStyle ? parentStyle.display : null,
                        innerHTMLLength: el.innerHTML.trim().length,
                        preview: el.innerHTML.trim().slice(0, 150) + '...'
                    }};
                }})()
            """)
            print(f"Container '{c}':", json.dumps(status, indent=2))
            print("-" * 30)

        # Let's inspect console errors
        # In CDP, we can request current console log history or inspect logs by listening.
        # But we can also check if there are any uncaught errors or window errors.
        # Let's query if any global JS errors occurred
        errors = await evaluate("window.errors || []")
        print("\nGlobal errors stored on window (if any):", errors)

asyncio.run(run_cdp())
