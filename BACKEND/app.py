from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

todos = []  # In memory list
next_id = 1

# Get all todos
@app.route("/todos", methods=["GET"])
def get_todos():
    return jsonify(todos)

# Add new todo
@app.route("/todos", methods=["POST"])
def add_todo():
    global next_id
    data = request.get_json()
    new_todo = {
        "id": next_id,
        "title": data.get("title", ""),
        "completed": False,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    todos.append(new_todo)
    next_id += 1
    return jsonify(new_todo), 201

# Toggle completion
@app.route("/todos/<int:todo_id>", methods=["PUT"])
def toggle_todo(todo_id):
    for todo in todos:
        if todo["id"] == todo_id:
            todo["completed"] = not todo["completed"]
            return jsonify(todo)
    return jsonify({"error": "Todo not found"}), 404

# Delete todo
@app.route("/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    global todos
    todos = [t for t in todos if t["id"] != todo_id]
    return jsonify({"message": "Deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True)

