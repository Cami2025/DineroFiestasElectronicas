from flask import Flask, request, jsonify

app = Flask(__name__)

# Base de datos temporal (puedes usar una real como MySQL o MongoDB más adelante)
deposits = []

@app.route('/add-deposit', methods=['POST'])
def add_deposit():
    data = request.json
    deposits.append(data)
    return jsonify({"message": "Depósito añadido", "deposits": deposits})

@app.route('/get-deposits', methods=['GET'])
def get_deposits():
    return jsonify(deposits)

if __name__ == '__main__':
    app.run(debug=True)
