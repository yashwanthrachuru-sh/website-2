import asyncio
import websockets
import json

async def verify_page_state():
    ws_url = "ws://127.0.0.1:9222/devtools/page/CA1AA8739C7A1320155914DE1274B72C"
    print(f"Connecting to CDP at {ws_url}...")
    
    logs = []
    
    async with websockets.connect(ws_url) as ws:
        # Enable domains
        await ws.send(json.dumps({"id": 1, "method": "Log.enable"}))
        await ws.send(json.dumps({"id": 2, "method": "Runtime.enable"}))
        await ws.send(json.dumps({"id": 3, "method": "Page.enable"}))
        
        async def listen():
            try:
                async for message in ws:
                    data = json.loads(message)
                    method = data.get("method")
                    if method == "Log.entryAdded":
                        entry = data.get("params", {}).get("entry", {})
                        logs.append(f"Log: {entry.get('level')} - {entry.get('text')}")
                    elif method == "Runtime.consoleAPICalled":
                        params = data.get("params", {})
                        args = params.get("args", [])
                        text = " ".join([arg.get("value", str(arg)) if isinstance(arg, dict) else str(arg) for arg in args])
                        logs.append(f"Console: {params.get('type')} - {text}")
                    elif method == "Runtime.exceptionThrown":
                        details = data.get("params", {}).get("exceptionDetails", {})
                        exception = details.get("exception", {})
                        logs.append(f"Exception: {details.get('text')} - {exception.get('description', '')}")
            except asyncio.CancelledError:
                pass
                
        listener_task = asyncio.create_task(listen())
        
        # Reload the page to ensure the new JS executes
        print("Reloading page...")
        await ws.send(json.dumps({"id": 4, "method": "Page.reload", "params": {"ignoreCache": True}}))
        
        # Wait 10 seconds for it to fully load
        print("Waiting 10 seconds for page to fully load and render...")
        await asyncio.sleep(10)
        
        # Helper to evaluate expression
        async def evaluate(expr):
            req_id = 1000 + hash(expr) % 1000
            await ws.send(json.dumps({
                "id": req_id,
                "method": "Runtime.evaluate",
                "params": {
                    "expression": expr,
                    "returnByValue": True
                }
            }))
            
            while True:
                resp = await ws.recv()
                data = json.loads(resp)
                if data.get("id") == req_id:
                    result = data.get("result", {}).get("result", {})
                    if "exceptionDetails" in data.get("result", {}):
                        print(f"Error evaluating '{expr}':", data["result"]["exceptionDetails"])
                        return None
                    return result.get("value")

        # Expose currentLessonUI to window.currentLessonUI on the page if it's not already
        await evaluate("window.currentLessonUI = typeof currentLessonUI !== 'undefined' ? currentLessonUI : null")
        
        print("\n--- Verifying currentLessonUI variables ---")
        schema_version = await evaluate("window.currentLessonUI ? window.currentLessonUI.schemaVersion : null")
        print("schemaVersion:", schema_version)
        
        has_overview = await evaluate("window.currentLessonUI && window.currentLessonUI.project ? true : false")
        print("has overview/project:", has_overview)
        
        beginner_keys = await evaluate("window.currentLessonUI && window.currentLessonUI.beginner ? Object.keys(window.currentLessonUI.beginner) : []")
        print("beginner keys:", beginner_keys)
        
        intermediate_keys = await evaluate("window.currentLessonUI && window.currentLessonUI.intermediate ? Object.keys(window.currentLessonUI.intermediate) : []")
        print("intermediate keys:", intermediate_keys)
        
        print("\n--- Verifying DOM element contents ---")
        containers = [
            "overviewContainer", "beginnerContainer", "intermediateContainer",
            "expertContainer", "projectContainer", "assessmentContainer",
            "cheatsheetContainer", "interviewContainer", "revisionContainer"
        ]
        
        for c in containers:
            text_len = await evaluate(f"document.getElementById('{c}') ? document.getElementById('{c}').innerHTML.trim().length : 0")
            print(f"Container '{c}' innerHTML length:", text_len)
            
        print("\n--- Captured logs during execution ---")
        for log in logs:
            print(log)
            
        listener_task.cancel()

asyncio.run(verify_page_state())
