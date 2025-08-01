#define s0 8
#define s1 9
#define s2 10
#define s3 11
#define out 12

#define LED_R 3
#define LED_G 5
#define LED_B 6

#define DELAY 2

int Red = 0, Blue = 0, Green = 0;
String inputCommand = "";

void setup() {
  pinMode(0, OUTPUT);
  pinMode(0, OUTPUT);
  pinMode(0, OUTPUT);

  pinMode(s0, OUTPUT);
  pinMode(s1, OUTPUT);
  pinMode(s2, OUTPUT);
  pinMode(s3, OUTPUT);
  pinMode(out, INPUT);

  Serial.begin(9600);
  digitalWrite(s0, HIGH);
  digitalWrite(s1, HIGH);
}

void loop() {
  if (Serial.available() > 0) {
    char c = Serial.read();
    if (c == '\n') {
      handleCommand(inputCommand);
      inputCommand = "";
    } else {
      inputCommand += c;
    }
  }
}

void handleCommand(String cmd) {
  if (cmd == "read") {
    GetColors();

    Serial.print("R:"); Serial.print(Red);
    Serial.print(" G:"); Serial.print(Green);
    Serial.print(" B:"); Serial.println(Blue);
    
    // Envía JSON para facilitar parseo desde Python
    Serial.print("{\"r\":");
    Serial.print(Red);
    Serial.print(",\"g\":");
    Serial.print(Green);
    Serial.print(",\"b\":");
    Serial.print(Blue);
    Serial.println("}");


    updateLEDs();
  }
}

void updateLEDs() {
  int r = constrain(map(Red, 15, 60, 255, 0), 0, 255);
  int g = constrain(map(Green, 30, 70, 255, 0), 0, 255);
  int b = constrain(map(Blue, 15, 70, 255, 0), 0, 255);

  if (r > g && r > b && g < 100) {
    analogWrite(LED_R, 255); analogWrite(LED_G, 0); analogWrite(LED_B, 0);
  } else if (g > r && g > b && r < 100) {
    analogWrite(LED_R, 0); analogWrite(LED_G, 255); analogWrite(LED_B, 0);
  } else if (b > r && b > g) {
    analogWrite(LED_R, 0); analogWrite(LED_G, 0); analogWrite(LED_B, 255);
  } else if (r > 120 && g > 120 && b < 80) {
    analogWrite(LED_R, 255); analogWrite(LED_G, 255); analogWrite(LED_B, 0);
  } else {
    // Color por defecto: blanco
    analogWrite(LED_R, 255);
    analogWrite(LED_G, 255);
    analogWrite(LED_B, 255);
  }
}


void GetColors() {
  digitalWrite(s2, LOW); digitalWrite(s3, LOW);
  Red = pulseIn(out, digitalRead(out) == HIGH ? LOW : HIGH);
  delay(DELAY);

  digitalWrite(s2, LOW); digitalWrite(s3, HIGH);
  Blue = pulseIn(out, digitalRead(out) == HIGH ? LOW : HIGH);
  delay(DELAY);

  digitalWrite(s2, HIGH); digitalWrite(s3, HIGH);
  Green = pulseIn(out, digitalRead(out) == HIGH ? LOW : HIGH);
  delay(DELAY);
}

