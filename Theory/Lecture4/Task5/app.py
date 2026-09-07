from flask import Flask, jsonify

app = Flask(__name__)

students = [
    {
        "id": 1,
        "name": "Aarav",
        "branch": "CSE"
    },
    {
        "id": 2,
        "name": "Diya",
        "branch": "ECE"
    },
    {
        "id": 3,
        "name": "Rahul",
        "branch": "IT"
    }
]

@app.route("/students", methods=["GET"])
def get_students():
    return jsonify(students)


if __name__ == "__main__":
    app.run(port=5000, debug=True)