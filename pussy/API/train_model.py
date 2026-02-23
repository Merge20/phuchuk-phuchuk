import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer

df = pd.read_csv("dataset.csv")

df = df.fillna("")

symptom_columns = df.columns[1:]

df["All_Symptoms"] = df[symptom_columns].values.tolist()

df["All_Symptoms"] = df["All_Symptoms"].apply(lambda x: [sym.strip() for sym in x if sym != ""])

mlb = MultiLabelBinarizer()

X = mlb.fit_transform(df["All_Symptoms"])
y = df["Disease"]

model = RandomForestClassifier(n_estimators=200)
model.fit(X, y)

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("symptoms.pkl", "wb") as f:
    pickle.dump(mlb.classes_.tolist(), f)

with open("mlb.pkl", "wb") as f:
    pickle.dump(mlb, f)

print("Model trained successfully.")