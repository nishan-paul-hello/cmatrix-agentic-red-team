⚙️ Chunk 5 of the paper

## 📌 Example: Product Requirement Document Output

**Task list**
```python
[
    "main.py",
    "canvas.py",
    "tools.py",
    "color_picker.py",
    "file_manager.py"
]
```

**Shared Knowledge**
```python
"""
The 'Tkinter' library is used for creating the GUI of the application. It provides various widgets
like frames and canvases which are used in this project.
The 'Pillow' library is used for handling image files. It is used in the 'file_manager.py' for
saving and opening image files.
The 'main.py' file is the entry point of the application. It initializes all the other components
and starts the application loop.
"""
```

**Anything UNCLEAR**
> The project requirements and implementation approach are clear. However, we need to ensure that all team members are familiar with the Tkinter and Pillow libraries. If not, they may need some time to learn these libraries before starting the development.

### 🔧 Engineer Role

Given the provided file structure and function definitions, an Engineer agent requires only fundamental development skills to complete the development tasks. Due to the large number of files, only one auto-generated code file is presented here.

**Generated code (`color_picker.py`)**
```python
import tkinter as tk
from tkinter import colorchooser

class ColorPicker:
    def __init__(self, root: tk.Tk, color: str = 'black'):
        self.frame = tk.Frame(root)
        self.color = color

        self.color_button = tk.Button(self.frame, text='Color', command=self.select_color)
        self.color_button.pack(fill='x')

    def select_color(self):
        color = colorchooser.askcolor()[1]
        if color is not None:
            self.color = color

    def pack(self, **kwargs):
        self.frame.pack(**kwargs)

    def get_color(self):
        return self.color
```

### 🧪 QA Engineer Role

Upon receiving the code output from the Engineer, the QA Engineer generates unit test code and reviews it to identify and fix any bugs, ensuring high-quality software.

**Generated Unit tests (`test.py`)**
```python
import unittest
import tkinter as tk
# You might want to move the ColorPicker class to another file, let's say color_picker.py
# from color_picker import ColorPicker

class TestColorPicker(unittest.TestCase):

    def setUp(self):
        self.root = tk.Tk()
        self.cp = ColorPicker(self.root)

    def tearDown(self):
        # This is important to close the tk window after tests
        self.root.destroy()

    def test_initial_color(self):
        # Test the default color during initialization
        self.assertEqual(self.cp.get_color(), 'black')

    def test_set_and_get_color(self):
        # Test setting a new color and retrieving it
        new_color = '#ffffff'  # white color
        self.cp.color = new_color
        self.assertEqual(self.cp.get_color(), new_color)


if __name__ == '__main__':
    unittest.main()
```

**Output:** MetaGPT generates a functional application named **"Drawing App"**.

🖼️ Figure 10: Screenshot of the generated "Drawing App" — a Tkinter window with a blank canvas, Save/Open/Color buttons, and Pencil/Brush/Eraser tools, alongside a separate color-picker window showing a color wheel, brightness slider, and OK/Cancel buttons.

---

## C. Experiments

### C.1 Details of the SoftwareDev Dataset

- The **SoftwareDev dataset** includes **70 diverse software development tasks**.
- Table 8 (not shown in this chunk) displays names/prompts for 11 of these tasks.
- The **first seven tasks** listed are used in the main experiments of this paper.

### C.2 Additional Results

#### 📊 Quantitative Results of MetaGPT

- MetaGPT achieves an **average score of 3.9**, surpassing ChatDev's score of **2.1**.
- General intelligent algorithms (AutoGPT, LangChain, AgentVerse) all score **1.0**, failing to generate executable code.
  - Generated code from these baselines is often short, lacks comprehensive logic, and fails to handle cross-file dependencies correctly.
- **Key gap in baselines:** AutoGPT, Langchain, and AgentVerse show robust general problem-solving but lack systematic requirement deconstruction — essential for complex system development.
- **MetaGPT's advantage:** simplifies transforming abstract requirements into detailed class/function designs via specialized division of labor and SOPs workflow.
- Compared to ChatDev, MetaGPT's **structured messaging and feedback mechanisms** reduce communication information loss and improve code execution.

**Table 4 — Executability Comparison**
*(Scale: 1 = complete failure, 2 = executable code, 3 = largely satisfies expected workflow, 4 = perfect match with expectations)*

| Task | AutoGPT | LangChain | AgentVerse | ChatDev | MetaGPT |
|---|---|---|---|---|---|
| Flappy bird | 1 | 1 | 1 | 2 | 3 |
| Tank battle game | 1 | 1 | 1 | 2 | 4 |
| 2048 game | 1 | 1 | 1 | 1 | 4 |
| Snake game | 1 | 1 | 1 | 3 | 4 |
| Brick breaker game | 1 | 1 | 1 | 1 | 4 |
| Excel data process | 1 | 1 | 1 | 4 | 4 |
| CRUD manage | 1 | 1 | 1 | 2 | 4 |
| **Average score** | **1.0** | **1.0** | **1.0** | **2.1** | **3.9** |

#### 🔬 MetaGPT w/o Executable Feedback

- Table 9 (not shown in this chunk) presents performance of MetaGPT with **GPT-4 32K** on 11 SoftwareDev tasks, plus average across all 70 tasks.
- This version is the **basic version without the executable feedback mechanism**.

#### 🔬 MetaGPT with Different LLM Backends

- 5 SoftwareDev tasks were randomly selected to test **GPT-3.5** and **Deepseek Coder 33B** as backends.
- MetaGPT can complete tasks with these LLMs, but **GPT-4 yields superior performance**.

**Table 5 — Performance of MetaGPT Using Different LLM Backends**

| Model | Open source | Time (s) | # Lines | Executability | Revisions |
|---|---|---|---|---|---|
| MetaGPT (w/ GPT-3.5) | ✗ | 75.18 | 161.6 | 2.8 | 2.4 |
| MetaGPT (w/ GPT-4) | ✗ | 552.94 | 178.2 | 3.8 | 1.2 |
| MetaGPT (w/ Deepseek Coder 33B) | ✓ | 1186.20 | 120.2 | 1.4 | 2.6 |

#### 📌 Impact of Instruction Levels (High-level vs. Detailed Instructions)

**Question:** Does the level of detail in the initial human input significantly influence performance?

**Examples:**
1. **High-level prompt:** "Create a brick breaker game."
2. **Detailed prompt:** "Creating a brick breaker game. In a brick breaker game, the player typically controls a paddle at the bottom of the screen to bounce a ball towards a wall of bricks. The goal is to break all the bricks by hitting them with the ball."

5 tasks from SoftwareDev were selected, with detailed prompts constructed for comparison.

**Table 6 — Impact of Instruction Levels**
*(Executability scale: 1 = complete failure, 2 = runnable code, 3 = largely expected workflow, 4 = perfect match to expectations)*

| Model | # Word | Time (s) | Token usage | # Lines | Executability | Productivity | Reversions |
|---|---|---|---|---|---|---|---|
| High-level | 13.2 | 552.9 | 28384.2 | 178.2 | 3.8 | 163.8 | 1.2 |
| Detailed | 42.2 | 567.8 | 29657.0 | 257.0 | 4.0 | 118.0 | 1.6 |

> **Note:** $\text{Productivity} = \dfrac{\text{Token usage}}{\text{Total Code Lines}}$ — lower is better.

**Findings:**
- Detailed prompts lead to better software projects with **lower productivity ratios** due to clearer requirements and functions.
- Simple (high-level) inputs can still generate good-enough software using MetaGPT, with an executability rating of **3.8** — comparable to the detailed prompt scenario.

#### 🔬 GPT Variants on HumanEval Benchmark

- Baseline: GPT-4's **67% HumanEval score** (OpenAI, 2023).
- Experiments run **5 times** with `gpt-4-0613` and `gpt-3.5-turbo-0613` under three conditions:
  - **(A)** Direct OpenAI API call with the HumanEval prompt.
  - **(B)** OpenAI API call + regex parsing of code from the response.
  - **(C)** Additional system prompt added: *"You are an AI that only responds with Python code, NOT ENGLISH. You will be given a function signature and its docstring by the user. Write your full implementation (restate the function signature)."*
- **Finding:** GPT-4 is more sensitive to prompt design, code parsing, and post-processing on HumanEval. GPT-3.5-Turbo struggles to return correct completions without prompt engineering.

**Table 7 — Performance of GPT Models on HumanEval**
*(5 runs each)*

| Settings | Model | 1 | 2 | 3 | 4 | 5 | Avg. | Std. |
|---|---|---|---|---|---|---|---|---|
| A | gpt-4-0613 | 0.732 | 0.707 | 0.732 | 0.713 | 0.738 | 0.724 | 0.013 |
| A | gpt-3.5-turbo-0613 | 0.360 | 0.366 | 0.360 | 0.348 | 0.354 | 0.357 | 0.007 |
| B | gpt-4-0613 | 0.787 | 0.811 | 0.817 | 0.829 | 0.817 | 0.812 | 0.016 |
| B | gpt-3.5-turbo-0613 | 0.348 | 0.354 | 0.348 | 0.335 | 0.348 | 0.346 | 0.007 |
| C | gpt-4-0613 | 0.805 | 0.805 | 0.817 | 0.793 | 0.780 | 0.800 | 0.014 |
| C | gpt-3.5-turbo-0613 | 0.585 | 0.567 | 0.573 | 0.579 | 0.579 | 0.577 | 0.007 |

#### 🎨 Qualitative Results

- Figures 11 and 12 (not included in this chunk) illustrate the Architect agent's design of a complex **recommender system**, showing system interface design and program call flow.
- Program call flow is described as essential for creating sophisticated automated systems, emphasizing the importance of division of labor in an automated software framework.

---

## D. Limitation and Ethics Concerns

### D.1 ⚠️ Limitations

**System side:**
- Cannot fully cater to specific scenarios such as **UI and frontend**, since UI/multimodal agents/tools have not yet been incorporated.
- Despite generating the most code among comparable frameworks, it remains challenging to fulfill real-world applications' diverse and complex requirements.

**Human user side:**
- A key challenge is the ability to **interrupt the running process** of each agent, or set a starting checkpoint for each agent.

### D.2 Ethics Concerns

**Unemployment and Skill Obsolescence**
- MetaGPT enables more people to program using natural language, lowering the barrier to entry for engineers.
- Programming languages have historically evolved (punched cards → assembly → C → Java → Python → natural language), each step making humans more proficient and increasing demand for programming-related roles.
- Natural language programming may offer an easier learning curve, broadening accessibility.

**Transparency and Accountability**
- MetaGPT is open-source and facilitates interactive multi-agent communication via natural language.
- Humans can initiate, observe, and stop execution with full control.
- Real-time interpretation/operation is displayed on-screen and logged, ensuring transparency.
- Human engineers remain the users and are responsible for outcomes.

**Privacy and Data Security**
- MetaGPT operates **locally**, ensuring user data privacy/security, and does not collect user data.
- For third-party LLM interactions (e.g., OpenAI), users are encouraged to review the relevant privacy policies.
- An **open-source LLM backend option** is also provided.
