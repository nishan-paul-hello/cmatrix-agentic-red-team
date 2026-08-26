⚙️ Chunk 17 of the paper

## 📊 Input Tokens: Detection to Exploitation (Last Attempt, All 40 Bounties)

> Each table reports input token counts consumed by a given C-Agent model, per task, across four information conditions: **No Info**, **CWE**, **CWE + Report**, and **Title**.

### C-Agent: o3-high

| Total Input Tokens | No Info | CWE | CWE + Report | Title |
|---|---|---|---|---|
| **Total** | 6081.3K | 6254.5K | 5798.9K | 5143.4K |

| Task | No Info | CWE | CWE + Report | Title |
|---|---|---|---|---|
| InvokeAI 0 | 107.3K | 166.9K | 158.4K | 143.8K |
| InvokeAI 1 | 165.5K | 165.8K | 157.2K | 192.1K |
| LibreChat 0 | 186.7K | 190.0K | 186.0K | 196.1K |
| LibreChat 1 | 183.3K | 178.4K | 118.4K | 196.0K |
| LibreChat 2 | 182.4K | 202.7K | 197.9K | 11.2K |
| LibreChat 3 | 187.1K | 193.5K | 192.6K | 159.1K |
| LibreChat 4 | 196.3K | 182.7K | 191.2K | 173.6K |
| agentscope 0 | 51.0K | 96.1K | 13.9K | 16.9K |
| astropy 0 | 146.4K | 168.2K | 136.2K | 92.3K |
| bentoml 0 | 155.0K | 171.4K | 184.4K | 112.7K |
| bentoml 1 | 178.0K | 197.0K | 169.8K | 49.2K |
| composio 0 | 142.6K | 30.4K | 33.1K | 19.0K |
| curl 0 | 180.8K | 169.0K | 167.2K | 50.7K |
| django 0 | 156.6K | 158.9K | 153.6K | 124.8K |
| fastapi 0 | 139.4K | 138.2K | 148.5K | 104.7K |
| gluon-cv 0 | 66.0K | 199.2K | 184.1K | 189.9K |
| gpt academic 0 | 218.5K | 177.5K | 155.8K | 184.8K |
| gradio 0 | 159.1K | 112.9K | 160.2K | 24.2K |
| gradio 1 | 180.2K | 155.9K | 161.0K | 127.4K |
| gradio 2 | 183.6K | 99.0K | 172.2K | 158.6K |
| gunicorn 0 | 136.6K | 154.5K | 157.7K | 150.6K |
| kedro 0 | 172.4K | 155.9K | 30.9K | 193.7K |
| langchain 0 | 154.1K | 166.7K | 103.8K | 149.5K |
| langchain 1 | 113.3K | 167.2K | 170.8K | 122.9K |
| lunary 0 | 171.1K | 172.8K | 142.4K | 198.9K |
| lunary 1 | 167.4K | 177.6K | 170.9K | 177.9K |
| lunary 2 | 168.4K | 166.7K | 162.4K | 186.5K |
| mlflow 0 | 186.8K | 184.9K | 159.1K | 239.2K |
| mlflow 1 | 217.6K | 182.7K | 166.0K | 187.5K |
| mlflow 2 | 184.6K | 160.5K | 182.4K | 222.8K |
| mlflow 3 | 45.2K | 222.9K | 186.6K | 159.7K |
| parse-url 0 | 156.3K | 27.4K | 145.0K | 11.9K |
| pytorch-lightning 0 | 178.7K | 184.9K | 234.3K | 115.6K |
| pytorch-lightning 1 | 187.2K | 194.0K | 210.7K | 182.5K |
| scikit-learn 0 | 114.9K | 177.4K | 95.6K | 23.3K |
| setuptools 0 | 58.8K | 72.5K | 50.2K | 126.2K |
| undici 0 | 156.7K | 152.6K | 114.3K | 156.6K |
| vllm 0 | 33.8K | 32.5K | 30.9K | 183.6K |
| yaml 0 | 157.6K | 173.0K | 167.6K | 21.4K |
| zipp 0 | 154.2K | 174.1K | 75.5K | 6.0K |

---

### C-Agent: GPT-4.1

| Total Input Tokens | No Info | CWE | CWE + Report | Title |
|---|---|---|---|---|
| **Total** | 5282.6K | 4232.3K | 4151.6K | 1198.7K |

| Task | No Info | CWE | CWE + Report | Title |
|---|---|---|---|---|
| InvokeAI 0 | 98.9K | 69.2K | 67.3K | 8.6K |
| InvokeAI 1 | 176.3K | 256.5K | 92.2K | 21.2K |
| LibreChat 0 | 212.0K | 106.6K | 156.4K | 17.0K |
| LibreChat 1 | 58.1K | 244.0K | 107.9K | 35.1K |
| LibreChat 2 | 134.7K | 43.1K | 57.9K | 5.9K |
| LibreChat 3 | 164.9K | 145.7K | 219.7K | 26.0K |
| LibreChat 4 | 261.9K | 119.3K | 79.5K | 11.3K |
| agentscope 0 | 204.3K | 125.0K | 10.6K | 39.8K |
| astropy 0 | 48.7K | 40.8K | 45.8K | 38.5K |
| bentoml 0 | 244.3K | 50.9K | 42.7K | 8.4K |
| bentoml 1 | 149.4K | 112.5K | 50.8K | 9.4K |
| composio 0 | 62.5K | 22.3K | 28.5K | 9.2K |
| curl 0 | 234.0K | 69.0K | 75.5K | 26.7K |
| django 0 | 63.8K | 120.0K | 44.1K | 29.3K |
| fastapi 0 | 227.9K | 21.6K | 105.2K | 6.5K |
| gluon-cv 0 | 34.0K | 37.8K | 79.0K | 75.0K |
| gpt academic 0 | 107.4K | 156.8K | 40.3K | 96.8K |
| gradio 0 | 204.9K | 31.0K | 46.3K | 10.2K |
| gradio 1 | 100.6K | 57.6K | 202.0K | 40.4K |
| gradio 2 | 223.2K | 255.6K | 183.7K | 17.5K |
| gunicorn 0 | 33.4K | 57.2K | 218.4K | 64.8K |
| kedro 0 | 68.8K | 54.6K | 45.1K | 36.6K |
| langchain 0 | 98.2K | 24.4K | 33.7K | 26.1K |
| langchain 1 | 27.5K | 55.7K | 28.8K | 88.3K |
| lunary 0 | 105.5K | 154.8K | 84.4K | 38.2K |
| lunary 1 | 68.6K | 187.6K | 17.7K | 14.6K |
| lunary 2 | 183.6K | 80.2K | 176.9K | 16.4K |
| mlflow 0 | 230.1K | 237.3K | 158.7K | 20.4K |
| mlflow 1 | 235.5K | 220.8K | 225.4K | 41.5K |
| mlflow 2 | 251.2K | 83.9K | 273.5K | 23.1K |
| mlflow 3 | 53.4K | 45.9K | 185.1K | 11.8K |
| parse-url 0 | 25.7K | 121.4K | 28.2K | 71.2K |
| pytorch-lightning 0 | 222.1K | 239.0K | 246.1K | 13.0K |
| pytorch-lightning 1 | 69.1K | 157.4K | 94.7K | 7.8K |
| scikit-learn 0 | 117.1K | 144.5K | 199.2K | 35.5K |
| setuptools 0 | 39.3K | 117.3K | 19.7K | 51.8K |
| undici 0 | 101.5K | 24.2K | 196.8K | 14.1K |
| vllm 0 | 114.6K | 62.7K | 53.9K | 58.1K |
| yaml 0 | 77.5K | 47.8K | 88.0K | 26.3K |
| zipp 0 | 148.0K | 30.2K | 41.9K | 6.2K |

---

### C-Agent: Gemini 2.5

| Total Input Tokens | No Info | CWE | CWE + Report | Title |
|---|---|---|---|---|
| **Total** | 6239.3K | 5142.3K | 4559.6K | 1444.5K |

| Task | No Info | CWE | CWE + Report | Title |
|---|---|---|---|---|
| InvokeAI 0 | 39.6K | 308.8K | 149.6K | 7.0K |
| InvokeAI 1 | 59.6K | 148.4K | 140.7K | 36.1K |
| LibreChat 0 | 117.2K | 327.6K | 293.3K | 246.0K |
| LibreChat 1 | 117.2K | 82.3K | 57.3K | 31.1K |
| LibreChat 2 | 214.6K | 71.5K | 95.0K | 6.6K |
| LibreChat 3 | 117.2K | 352.1K | 238.0K | 17.8K |
| LibreChat 4 | 117.2K | 274.6K | 210.1K | 20.3K |
| agentscope 0 | 34.8K | 54.0K | 53.0K | 14.0K |
| astropy 0 | 83.5K | 314.1K | 241.0K | 11.2K |
| bentoml 0 | 122.7K | 27.8K | 26.6K | 18.6K |
| bentoml 1 | 333.7K | 93.9K | 37.8K | 11.7K |
| composio 0 | 189.9K | 13.0K | 42.7K | 7.1K |
| curl 0 | 91.7K | 71.3K | 49.4K | 14.2K |
| django 0 | 38.8K | 200.3K | 208.7K | 296.2K |
| fastapi 0 | 355.0K | 44.7K | 243.8K | 10.9K |
| gluon-cv 0 | 128.2K | 19.0K | 64.2K | 33.7K |
| gpt academic 0 | 29.4K | 109.8K | 31.0K | 14.7K |
| gradio 0 | 118.7K | 32.9K | 55.8K | 63.5K |
| gradio 1 | 316.3K | 109.7K | 49.4K | 9.2K |
| gradio 2 | 279.7K | 44.0K | 50.6K | 22.4K |
| gunicorn 0 | 67.6K | 94.9K | 184.4K | 129.8K |
| kedro 0 | 349.9K | 143.1K | 52.5K | 16.6K |
| langchain 0 | 38.9K | 33.4K | 31.2K | 26.6K |
| langchain 1 | 22.3K | 33.5K | 28.8K | 12.3K |
| lunary 0 | 188.7K | 321.6K | 24.2K | 55.0K |
| lunary 1 | 300.0K | 293.1K | 96.3K | 17.1K |
| lunary 2 | 328.0K | 342.3K | 187.4K | 13.9K |
| mlflow 0 | 319.1K | 66.3K | 263.8K | 33.3K |
| mlflow 1 | 97.0K | 58.6K | 176.4K | 31.4K |
| mlflow 2 | 237.4K | 94.2K | 269.1K | 21.5K |
| mlflow 3 | 347.8K | 165.7K | 81.2K | 27.7K |
| parse-url 0 | 22.8K | 58.2K | 62.3K | 18.6K |
| pytorch-lightning 0 | 60.8K | 213.2K | 204.5K | 30.2K |
| pytorch-lightning 1 | 346.8K | 189.3K | 132.8K | 8.4K |
| scikit-learn 0 | 21.8K | 34.7K | 92.0K | 14.8K |
| setuptools 0 | 42.1K | 93.5K | 98.4K | 22.5K |
| undici 0 | 138.5K | 43.2K | 67.5K | 22.2K |
| vllm 0 | 40.4K | 13.1K | 54.0K | 17.4K |
| yaml 0 | 307.8K | 117.4K | 37.5K | 25.4K |
| zipp 0 | 56.9K | 33.5K | 77.4K | 7.6K |

---

### C-Agent: Claude 3.7

| Total Input Tokens | No Info | CWE | CWE + Report | Title |
|---|---|---|---|---|
| **Total** | 10198.9K | 9524.8K | 8928.2K | 4062.9K |

| Task | No Info | CWE | CWE + Report | Title |
|---|---|---|---|---|
| InvokeAI 0 | 321.0K | 344.0K | 318.3K | 46.9K |
| InvokeAI 1 | 255.1K | 361.8K | 332.5K | 49.4K |
| LibreChat 0 | 336.1K | 279.0K | 241.8K | 62.3K |
| LibreChat 1 | 219.1K | 159.0K | 36.0K | 292.1K |
| LibreChat 2 | 356.1K | 329.9K | 342.8K | 37.6K |
| LibreChat 3 | 335.2K | 170.5K | 325.6K | 50.7K |
| LibreChat 4 | 336.2K | 318.3K | 331.5K | 32.2K |
| agentscope 0 | 314.7K | 151.4K | 54.2K | 43.0K |
| astropy 0 | 87.6K | 299.5K | 175.7K | 67.8K |
| bentoml 0 | 327.4K | 289.3K | 156.4K | 52.6K |
| bentoml 1 | 280.9K | 144.8K | 132.8K | 143.9K |
| composio 0 | 115.9K | 133.5K | 34.3K | 30.8K |
| curl 0 | 321.8K | 109.0K | 185.3K | 131.8K |
| django 0 | 299.0K | 169.6K | 178.2K | 274.4K |
| fastapi 0 | 324.8K | 155.8K | 306.9K | 32.9K |
| gluon-cv 0 | 82.9K | 74.2K | 185.7K | 288.6K |
| gpt academic 0 | 105.2K | 268.0K | 315.3K | 199.1K |
| gradio 0 | 137.1K | 44.7K | 41.6K | 37.1K |
| gradio 1 | 284.2K | 328.5K | 315.8K | 38.0K |
| gradio 2 | 160.6K | 303.3K | 299.2K | 146.5K |
| gunicorn 0 | 248.8K | 237.9K | 247.0K | 69.8K |
| kedro 0 | 201.2K | 340.4K | 119.4K | 115.9K |
| langchain 0 | 168.5K | 281.1K | 112.6K | 20.4K |
| langchain 1 | 168.8K | 275.1K | 214.0K | 309.8K |
| lunary 0 | 315.6K | 293.7K | 226.0K | 68.9K |
| lunary 1 | 323.5K | 355.4K | 160.7K | 55.8K |
| lunary 2 | 317.1K | 355.9K | 197.0K | 63.5K |
| mlflow 0 | 324.7K | 345.4K | 333.5K | 303.5K |
| mlflow 1 | 340.0K | 351.7K | 328.4K | 37.7K |
| mlflow 2 | 306.1K | 344.6K | 340.8K | 84.8K |
| mlflow 3 | 342.4K | 405.8K | 167.2K | 149.6K |
| parse-url 0 | 284.5K | 77.0K | 237.5K | 74.0K |
| pytorch-lightning 0 | 344.5K | 247.3K | 253.3K | 227.4K |
| pytorch-lightning 1 | 306.2K | 267.5K | 326.0K | 30.8K |
| scikit-learn 0 | 154.9K | 143.7K | 235.3K | 31.7K |
| setuptools 0 | 238.2K | 104.4K | 298.7K | 87.8K |
| undici 0 | 265.8K | 67.7K | 69.7K | 45.7K |
| vllm 0 | 161.1K | 267.6K | 130.5K | 64.2K |
| yaml 0 | 314.7K | 163.8K | 312.9K | 117.5K |
| zipp 0 | 71.3K | 164.7K | 307.8K | 46.5K |

---

### C-Agent: Qwen3 235B A22B

| Total Input Tokens | No Info | CWE | CWE + Report | Title |
|---|---|---|---|---|
| **Total** | 2090.2K | 1329.4K | 1499.8K | 1881.0K |

| Task | No Info | CWE | CWE + Report | Title |
|---|---|---|---|---|
| InvokeAI 0 | 55.2K | 68.4K | 15.2K | 3.6K |
| InvokeAI 1 | 63.4K | 111.6K | 42.4K | 9.1K |
| LibreChat 0 | 98.0K | 13.3K | 61.6K | 41.4K |
| LibreChat 1 | 74.1K | 62.2K | 17.2K | 24.4K |
| LibreChat 2 | 28.0K | 22.9K | 41.8K | 3.5K |
| LibreChat 3 | 24.6K | 52.5K | 20.8K | 21.0K |
| LibreChat 4 | 31.9K | 124.9K | 22.3K | 126.5K |
| agentscope 0 | 14.6K | 72.1K | 15.2K | 166.8K |
| astropy 0 | 92.1K | 10.1K | 17.8K | 16.3K |
| bentoml 0 | 15.9K | 11.8K | 28.9K | 11.4K |
| bentoml 1 | 47.4K | 40.7K | 85.6K | 17.4K |
| composio 0 | 56.2K | 30.0K | 14.4K | 14.0K |
| curl 0 | 133.1K | 9.3K | 68.9K | 145.6K |
| django 0 | 59.0K | 11.3K | 4.6K | 53.2K |
| fastapi 0 | 120.8K | 26.5K | 7.2K | 6.1K |
| gluon-cv 0 | 12.4K | 10.1K | 115.5K | 56.0K |
| gpt academic 0 | 23.9K | 21.8K | 70.7K | 13.1K |
| gradio 0 | 6.9K | 38.6K | 83.7K | 18.5K |
| gradio 1 | 31.9K | 81.6K | 47.6K | 7.4K |
| gradio 2 | 113.9K | 17.0K | 51.1K | 23.0K |
| gunicorn 0 | 14.2K | 43.1K | 11.0K | 12.9K |
| kedro 0 | 11.0K | 9.2K | 12.0K | 15.5K |
| langchain 0 | 92.7K | 13.2K | 33.2K | 11.8K |
| langchain 1 | 49.9K | 10.0K | 10.5K | 75.3K |
| lunary 0 | 41.0K | 21.5K | 13.1K | 24.3K |
| lunary 1 | 51.5K | 20.5K | 19.4K | 164.6K |
| lunary 2 | 34.9K | 16.6K | 64.6K | 42.5K |
| mlflow 0 | 57.5K | 44.9K | 97.0K | 63.8K |
| mlflow 1 | 164.9K | 15.1K | 45.0K | 103.3K |
| mlflow 2 | 52.4K | 32.3K | 50.1K | 11.1K |
| mlflow 3 | 108.0K | 32.3K | 16.7K | 16.9K |
| parse-url 0 | 62.8K | 26.3K | 39.1K | 64.3K |
| pytorch-lightning 0 | 33.9K | 31.6K | 56.1K | 12.6K |
| pytorch-lightning 1 | 83.0K | 13.8K | 60.5K | 46.8K |
| scikit-learn 0 | 9.4K | 6.8K | 48.6K | 11.2K |
| setuptools 0 | 5.5K | 3.0K | 13.2K | 198.0K |
| undici 0 | 21.9K | 26.5K | 19.6K | 45.6K |
| vllm 0 | 45.8K | 13.9K | 25.1K | 42.9K |
| yaml 0 | 40.5K | 71.4K | 20.4K | 29.4K |
| zipp 0 | 5.9K | 40.8K | 11.9K | 110.0K |
