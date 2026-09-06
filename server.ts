import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
    }
  }
  return aiClient;
}

// In-Memory Relational Database with realistic seed data
interface DbState {
  users: any[];
  subjects: any[];
  notes: any[];
  documents: any[];
  quizzes: any[];
  studyPlans: any[];
  bookmarks: any[];
  notifications: any[];
  assignments: any[];
  submissions: any[];
  history: any[];
  aiUsage: {
    totalRequests: number;
    chatRequests: number;
    notesGenerated: number;
    quizzesGenerated: number;
    pdfSummaries: number;
    studyPlansGenerated: number;
    estimatedTokens: number;
    apiErrors: number;
  };
}

const db: DbState = {
  users: [
    {
      id: "usr_student_1",
      name: "Alex Johnson",
      email: "alex.student@university.edu",
      role: "student",
      college: "Stanford Institute of Technology",
      course: "Computer Science & Engineering",
      semester: "6th Semester",
      interests: ["Data Structures & Algorithms", "Operating Systems", "Artificial Intelligence", "Full-Stack Development"],
      preferredStudyTime: "Evening (6:00 PM - 10:00 PM)",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      createdAt: "2026-01-15T08:00:00Z",
    },
    {
      id: "usr_teacher_1",
      name: "Prof. Priya Sharma",
      email: "prof.sharma@university.edu",
      role: "teacher",
      college: "Stanford Institute of Technology",
      course: "Department of Computer Science",
      semester: "Faculty",
      interests: ["Database Systems", "Operating Systems", "Cloud Computing"],
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      createdAt: "2025-08-10T10:30:00Z",
    },
    {
      id: "usr_admin_1",
      name: "Dr. Arthur Pendelton",
      email: "admin@university.edu",
      role: "admin",
      college: "University Academic Center",
      course: "System Administration",
      semester: "Admin Directorate",
      interests: ["EdTech Governance", "Curriculum Analytics", "AI Ethics"],
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      createdAt: "2025-01-01T00:00:00Z",
    },
  ],
  subjects: [
    {
      id: "sub_1",
      name: "Data Structures & Algorithms",
      code: "CS301",
      description: "Advanced Trees, Graph Algorithms, Dynamic Programming, and Complexity Analysis",
      teacherId: "usr_teacher_1",
      teacherName: "Prof. Priya Sharma",
      topicsCount: 24,
      completedTopics: 19,
      progress: 80,
      averageScore: 84,
      lastStudiedTopic: "Binary Search Trees & AVL Rotations",
      color: "from-indigo-500 to-purple-600",
      iconName: "Binary",
    },
    {
      id: "sub_2",
      name: "Operating Systems",
      code: "CS302",
      description: "Process Synchronization, CPU Scheduling, Deadlocks, Memory Management, and File Systems",
      teacherId: "usr_teacher_1",
      teacherName: "Prof. Priya Sharma",
      topicsCount: 20,
      completedTopics: 11,
      progress: 55,
      averageScore: 68,
      lastStudiedTopic: "Semaphore & Mutex Synchronization",
      color: "from-cyan-500 to-blue-600",
      iconName: "Cpu",
    },
    {
      id: "sub_3",
      name: "Database Management Systems",
      code: "CS303",
      description: "Relational Algebra, SQL Optimization, Normalization, ACID Transactions, and NoSQL",
      teacherId: "usr_teacher_1",
      teacherName: "Prof. Priya Sharma",
      topicsCount: 18,
      completedTopics: 12,
      progress: 68,
      averageScore: 78,
      lastStudiedTopic: "B+ Tree Indexing & Query Execution",
      color: "from-emerald-500 to-teal-600",
      iconName: "Database",
    },
    {
      id: "sub_4",
      name: "Computer Networks",
      code: "CS304",
      description: "TCP/IP Protocol Suite, Congestion Control, Routing Algorithms, and Network Security",
      teacherId: "usr_teacher_1",
      teacherName: "Prof. Priya Sharma",
      topicsCount: 22,
      completedTopics: 10,
      progress: 45,
      averageScore: 62,
      lastStudiedTopic: "Dijkstra Link State Routing",
      color: "from-amber-500 to-orange-600",
      iconName: "Network",
    },
  ],
  notes: [
    {
      id: "note_1",
      userId: "usr_student_1",
      subjectId: "sub_1",
      subjectName: "Data Structures & Algorithms",
      title: "Binary Search Trees: Insertion, Deletion & Balancing",
      topic: "Binary Search Trees",
      difficulty: "Intermediate",
      style: "Detailed Notes",
      content: `# Binary Search Trees (BST) Comprehensive Notes

## 1. Fundamental Concept
A Binary Search Tree is a node-based binary tree data structure which has the following properties:
- The left subtree of a node contains only nodes with keys lesser than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- Both the left and right subtrees must also be binary search trees.

## 2. Time Complexities
| Operation | Average Case | Worst Case (Degenerate Tree) | Balanced (AVL/Red-Black) |
|---|---|---|---|
| Search | O(log n) | O(n) | O(log n) |
| Insertion | O(log n) | O(n) | O(log n) |
| Deletion | O(log n) | O(n) | O(log n) |

## 3. Tree Traversals
- **Inorder (Left, Root, Right)**: Yields values in non-decreasing sorted order.
- **Preorder (Root, Left, Right)**: Useful for creating copies of tree structures.
- **Postorder (Left, Right, Root)**: Useful for node deallocations / bottom-up calculations.`,
      keyPoints: [
        "Inorder traversal of a BST always yields keys in ascending sorted order.",
        "Worst case time complexity occurs when elements are inserted in already sorted order, causing O(n) degenerate skew.",
        "Deletion of a node with two children requires replacing it with its in-order predecessor or in-order successor.",
      ],
      importantDefinitions: [
        { term: "In-order Successor", definition: "The node with the smallest key strictly greater than the given node's key (leftmost child of right subtree)." },
        { term: "Height Balance Factor", definition: "The difference between the height of the left subtree and the height of the right subtree: Balance = height(Left) - height(Right)." },
      ],
      examPoints: [
        "Expect direct questions on deleting nodes having two children with step-by-step pointer reassignment.",
        "Remember AVL rotation patterns: LL -> Single Right, RR -> Single Left, LR -> Left-Right double rotation, RL -> Right-Left double rotation.",
      ],
      summary: "BSTs provide average O(log n) search and insertion, but require self-balancing trees like AVL or Red-Black trees to prevent O(n) degradation.",
      possibleQuestions: [
        "How do you find the in-order successor of a node in a BST without a parent pointer?",
        "Explain the four rotation cases in AVL trees with visual sketches.",
      ],
      isBookmarked: true,
      createdAt: "2026-03-01T14:20:00Z",
    },
    {
      id: "note_2",
      userId: "usr_student_1",
      subjectId: "sub_2",
      subjectName: "Operating Systems",
      title: "Deadlock Prevention, Avoidance & Banker's Algorithm",
      topic: "Deadlocks",
      difficulty: "Advanced",
      style: "Exam Focus",
      content: `# Deadlocks in Modern Operating Systems

## 1. Coffman Conditions (All 4 must hold simultaneously)
1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.
2. **Hold and Wait**: A process must currently hold at least one resource and be waiting to acquire additional resources held by other processes.
3. **No Preemption**: Resources cannot be preempted; a resource can only be released voluntarily by the process holding it.
4. **Circular Wait**: A closed loop of processes exists such that each process holds a resource that the next process needs.

## 2. Banker's Algorithm (Dijkstra)
- Evaluates resource allocation safety before granting requests.
- Vectors and Matrices:
  - **Available[m]**: Quantity of available instances per resource type.
  - **Max[n][m]**: Maximum claim of each process.
  - **Allocation[n][m]**: Currently assigned resource instances.
  - **Need[n][m] = Max[n][m] - Allocation[n][m]**.`,
      keyPoints: [
        "Eliminating ANY ONE of the four Coffman conditions guarantees deadlock freedom.",
        "Deadlock avoidance uses dynamically maintained resource state knowledge (Safe vs Unsafe states).",
        "A safe state is not deadlocked, and deadlocks are subsets of unsafe states.",
      ],
      importantDefinitions: [
        { term: "Safe State", definition: "A state is safe if there exists a safe sequence <P1, P2, ..., Pn> of processes such that all can finish execution." },
        { term: "Starvation", definition: "Indefinite delay where a process waits perpetually because other processes are repeatedly favored." },
      ],
      examPoints: [
        "Banker's Algorithm numerical calculation: Always compute the Need matrix first using Need = Max - Allocation.",
        "Safe sequence verification is a mandatory 10-mark examination problem.",
      ],
      summary: "Deadlock handling involves Prevention (breaking Coffman conditions), Avoidance (Banker's algorithm), or Detection and Recovery.",
      possibleQuestions: [
        "Given Allocation and Max matrices, determine if the system is in a safe state and output the safe sequence.",
      ],
      isBookmarked: false,
      createdAt: "2026-03-03T16:45:00Z",
    },
  ],
  documents: [
    {
      id: "doc_1",
      userId: "usr_student_1",
      filename: "Computer_Networks_Transport_Layer_Guide.pdf",
      fileSize: "2.4 MB",
      fileType: "application/pdf",
      summary: "This comprehensive document covers the Transport Layer of the OSI and TCP/IP models, detailing connection-oriented TCP versus connectionless UDP, 3-way handshake mechanics, flow control (Sliding Window Protocol), and TCP Reno/Cubic Congestion Control algorithms.",
      keyPoints: [
        "TCP provides reliable byte-stream transmission, sequence numbering, and acknowledgement guarantees.",
        "UDP offers low-latency, lightweight best-effort datagram delivery ideal for DNS, VoIP, and real-time gaming.",
        "TCP Congestion Control phases: Slow Start (exponential growth), Congestion Avoidance (additive increase), and Fast Recovery.",
      ],
      importantTerms: [
        { term: "SYN-ACK Handshake", definition: "Three-step exchange (SYN, SYN-ACK, ACK) establishing sequence numbers and socket connection state." },
        { term: "Congestion Window (cwnd)", definition: "Variable maintained by sender that limits the amount of unacknowledged data transmitted." },
      ],
      examFocus: [
        "Differentiate TCP vs UDP across 6 distinct parameters (Header size, reliability, flow control, overhead, connection state, use-cases).",
        "Derive TCP throughput formula based on round trip time (RTT) and packet loss probability.",
      ],
      questions: [
        "How does TCP handle out-of-order packets and buffer starvation?",
        "Why is Fast Retransmit triggered on receiving three duplicate ACKs?",
      ],
      createdAt: "2026-03-02T11:15:00Z",
    },
  ],
  quizzes: [
    {
      id: "quiz_1",
      userId: "usr_student_1",
      subjectId: "sub_1",
      subjectName: "Data Structures & Algorithms",
      title: "Trees & Binary Search Trees Mastery Quiz",
      topic: "Binary Search Trees",
      difficulty: "Intermediate",
      questionType: "MCQ",
      totalQuestions: 5,
      score: 80,
      correctAnswersCount: 4,
      timeTakenSeconds: 215,
      questions: [
        {
          id: "q1",
          question: "Which traversal of a Binary Search Tree produces elements in monotonically increasing order?",
          options: ["Preorder", "Inorder", "Postorder", "Level Order"],
          correctAnswer: "Inorder",
          explanation: "Inorder traversal visits the left subtree, root node, and right subtree recursively, resulting in sorted ascending order for BSTs.",
          userAnswer: "Inorder",
        },
        {
          id: "q2",
          question: "What is the worst-case time complexity of searching in an unbalanced BST with n nodes?",
          options: ["O(log n)", "O(1)", "O(n)", "O(n log n)"],
          correctAnswer: "O(n)",
          explanation: "When elements are inserted in already sorted sequence, the tree degenerates into a linear linked-list chain, taking O(n) search time.",
          userAnswer: "O(n)",
        },
        {
          id: "q3",
          question: "In an AVL tree, what is the maximum allowable height difference between left and right subtrees?",
          options: ["0", "1", "2", "log(n)"],
          correctAnswer: "1",
          explanation: "The balance factor of any node in an AVL tree is strictly constrained to {-1, 0, 1}.",
          userAnswer: "1",
        },
        {
          id: "q4",
          question: "Which rotation is required to rebalance an AVL tree when an insertion occurs in the right child of the left subtree (LR case)?",
          options: ["Single Right Rotation", "Single Left Rotation", "Left-Right Double Rotation", "Right-Left Double Rotation"],
          correctAnswer: "Left-Right Double Rotation",
          explanation: "An LR imbalance requires a left rotation on the left child followed by a right rotation on the root node.",
          userAnswer: "Left-Right Double Rotation",
        },
        {
          id: "q5",
          question: "What is the minimum number of nodes in an AVL tree of height 3 (height of single node = 0)?",
          options: ["4", "7", "8", "10"],
          correctAnswer: "7",
          explanation: "Using the recurrence N(h) = N(h-1) + N(h-2) + 1 with N(0)=1 and N(1)=2: N(2)=2+1+1=4, N(3)=4+2+1=7.",
          userAnswer: "8",
        },
      ],
      aiFeedback: {
        strengths: ["Solid mastery of tree traversal mechanics and BST degradation properties", "Accurate recall of AVL balance factor limits and rotation categories"],
        weaknesses: ["Recurrence calculation for minimum AVL node bounds under time pressure"],
        recommendations: ["Review the formula N(h) = N(h-1) + N(h-2) + 1 for Fibonacci-like AVL minimum node bounds", "Practice 3 practice problems on AVL node-to-height bounds"],
        summary: "Excellent performance (80%). Your algorithmic fundamentals on tree traversal and rotation triggers are strong.",
      },
      createdAt: "2026-03-04T09:30:00Z",
      completedAt: "2026-03-04T09:34:00Z",
    },
  ],
  studyPlans: [
    {
      id: "plan_1",
      userId: "usr_student_1",
      title: "Semester Final Exam Preparation Strategy",
      examDate: "2026-04-15",
      dailyHours: 4,
      targetScore: 90,
      subjectsKnowledge: [
        { subject: "Data Structures & Algorithms", proficiency: 75 },
        { subject: "Operating Systems", proficiency: 45 },
        { subject: "Database Management Systems", proficiency: 65 },
        { subject: "Computer Networks", proficiency: 40 },
      ],
      schedule: [
        {
          id: "item_1",
          day: "Monday",
          time: "09:00 AM - 10:30 AM",
          subject: "Operating Systems",
          topic: "Process Scheduling & Deadlock Banker's Algorithm",
          activity: "Theory Revision & Numerical Problems",
          duration: "90 mins",
          completed: true,
        },
        {
          id: "item_2",
          day: "Monday",
          time: "10:45 AM - 11:45 AM",
          subject: "Data Structures & Algorithms",
          topic: "Binary Search Trees & AVL Rotations",
          activity: "Code Practice & In-order Deletion",
          duration: "60 mins",
          completed: true,
        },
        {
          id: "item_3",
          day: "Monday",
          time: "02:00 PM - 03:00 PM",
          subject: "Computer Networks",
          topic: "TCP vs UDP & Congestion Control",
          activity: "Concept Note Review & Diagramming",
          duration: "60 mins",
          completed: false,
        },
        {
          id: "item_4",
          day: "Tuesday",
          time: "09:00 AM - 10:30 AM",
          subject: "Operating Systems",
          topic: "Virtual Memory & Page Replacement (FIFO, LRU, Optimal)",
          activity: "Practice Problem Sets",
          duration: "90 mins",
          completed: false,
        },
        {
          id: "item_5",
          day: "Tuesday",
          time: "10:45 AM - 12:00 PM",
          subject: "Database Management Systems",
          topic: "B+ Tree Indexing & SQL Query Plans",
          activity: "Mock Quiz & Query Optimization",
          duration: "75 mins",
          completed: false,
        },
        {
          id: "item_6",
          day: "Wednesday",
          time: "09:00 AM - 10:30 AM",
          subject: "Computer Networks",
          topic: "Dijkstra's Link State Routing & Distance Vector",
          activity: "Network Topology Calculations",
          duration: "90 mins",
          completed: false,
        },
      ],
      createdAt: "2026-03-01T10:00:00Z",
    },
  ],
  bookmarks: [
    {
      id: "bm_1",
      userId: "usr_student_1",
      contentType: "note",
      contentId: "note_1",
      title: "Binary Search Trees: Insertion, Deletion & Balancing",
      snippet: "Comprehensive BST notes covering traversals, AVL rotations, and average vs worst case time complexities.",
      subjectName: "Data Structures & Algorithms",
      createdAt: "2026-03-01T14:25:00Z",
    },
    {
      id: "bm_2",
      userId: "usr_student_1",
      contentType: "ai_answer",
      contentId: "chat_ans_1",
      title: "Explanation of Mutex vs Semaphore",
      snippet: "A Mutex is a locking mechanism (binary: locked/unlocked) owned by the thread that locked it. A Semaphore is a signaling mechanism...",
      subjectName: "Operating Systems",
      createdAt: "2026-03-03T18:10:00Z",
    },
  ],
  notifications: [
    {
      id: "notif_1",
      userId: "usr_student_1",
      title: "Study Reminder ⏰",
      message: "Time for your scheduled Operating Systems review on Virtual Memory & Page Replacement.",
      type: "reminder",
      isRead: false,
      createdAt: "2026-03-05T08:30:00Z",
      link: "/study-planner",
    },
    {
      id: "notif_2",
      userId: "usr_student_1",
      title: "AI Recommendation 🎯",
      message: "We noticed your Computer Networks progress is 45%. We generated a 10-minute revision quiz for you.",
      type: "recommendation",
      isRead: false,
      createdAt: "2026-03-04T15:00:00Z",
      link: "/quizzes",
    },
    {
      id: "notif_3",
      userId: "usr_student_1",
      title: "Assignment Graded 📝",
      message: "Prof. Priya Sharma graded your 'B+ Trees Indexing' assignment: 92/100 (A+).",
      type: "achievement",
      isRead: true,
      createdAt: "2026-03-03T12:00:00Z",
      link: "/subjects",
    },
  ],
  assignments: [
    {
      id: "asg_1",
      teacherId: "usr_teacher_1",
      subjectId: "sub_3",
      subjectName: "Database Management Systems",
      title: "Assignment 3: B+ Tree Indexing & Query Plan Optimization",
      description: "Analyze the given schema with 1,000,000 records. Construct secondary B+ tree indices and contrast cost metrics before and after indexing.",
      deadline: "2026-03-15T23:59:00Z",
      totalStudents: 42,
      submittedCount: 36,
      createdAt: "2026-02-28T10:00:00Z",
    },
    {
      id: "asg_2",
      teacherId: "usr_teacher_1",
      subjectId: "sub_2",
      subjectName: "Operating Systems",
      title: "Assignment 2: Banker's Safety Algorithm Implementation",
      description: "Implement Banker's algorithm in Python or C++ to simulate deadlock avoidance given dynamic resource request vectors.",
      deadline: "2026-03-20T23:59:00Z",
      totalStudents: 42,
      submittedCount: 28,
      createdAt: "2026-03-01T11:00:00Z",
    },
  ],
  submissions: [
    {
      id: "subm_1",
      assignmentId: "asg_1",
      studentId: "usr_student_1",
      studentName: "Alex Johnson",
      studentEmail: "alex.student@university.edu",
      content: "Submitted SQL schema benchmarks and B+ tree height analysis with execution plans. Found 74% reduction in query scan cost with composite index.",
      score: 92,
      feedback: "Thorough analysis of cluster vs unclustered indices. Excellent execution plan visualization.",
      status: "graded",
      submittedAt: "2026-03-02T19:40:00Z",
    },
  ],
  history: [
    {
      id: "hist_1",
      userId: "usr_student_1",
      actionType: "asked_ai",
      title: "Asked AI Tutor: 'Explain deadlock conditions & prevention'",
      subtitle: "Operating Systems • 4 quick follow-ups asked",
      timestamp: "Today, 10:15 AM",
    },
    {
      id: "hist_2",
      userId: "usr_student_1",
      actionType: "completed_quiz",
      title: "Completed Quiz: 'Trees & Binary Search Trees'",
      subtitle: "Score: 80% (4/5 correct) • Time: 3m 35s",
      timestamp: "Yesterday, 04:30 PM",
    },
    {
      id: "hist_3",
      userId: "usr_student_1",
      actionType: "generated_notes",
      title: "Generated Notes: 'Deadlock Prevention & Banker's Algorithm'",
      subtitle: "Operating Systems • Exam Focus Style",
      timestamp: "Mar 3, 2026",
    },
    {
      id: "hist_4",
      userId: "usr_student_1",
      actionType: "summarized_pdf",
      title: "Summarized Document: 'Computer Networks Transport Layer Guide.pdf'",
      subtitle: "Extracted 5 key points • 2 practice questions",
      timestamp: "Mar 2, 2026",
    },
  ],
  aiUsage: {
    totalRequests: 342,
    chatRequests: 184,
    notesGenerated: 58,
    quizzesGenerated: 42,
    pdfSummaries: 34,
    studyPlansGenerated: 24,
    estimatedTokens: 489200,
    apiErrors: 0,
  },
};

// ==========================================
// AUTH & USERS ENDPOINTS
// ==========================================

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, role } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase()) ||
    db.users.find((u) => u.role === role) ||
    db.users[0];

  res.json({
    success: true,
    user,
    token: `jwt_token_${user.id}_${Date.now()}`,
  });
});

app.post("/api/auth/register", (req: Request, res: Response) => {
  const { name, email, role, college, course, semester, interests, preferredStudyTime } = req.body;
  const newUser = {
    id: `usr_${Date.now()}`,
    name: name || "New User",
    email: email || `user_${Date.now()}@university.edu`,
    role: role || "student",
    college: college || "Institute of Technology",
    course: course || "Computer Science",
    semester: semester || "1st Semester",
    interests: interests || ["General Sciences", "AI"],
    preferredStudyTime: preferredStudyTime || "Evening",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  res.json({ success: true, user: newUser, token: `jwt_token_${newUser.id}` });
});

app.post("/api/auth/forgot-password", (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `Verification reset code sent to ${email || "registered email"}. For demo purposes, code is 849201.`,
    demoCode: "849201",
  });
});

app.post("/api/auth/reset-password", (req: Request, res: Response) => {
  res.json({ success: true, message: "Password updated successfully. You can now login." });
});

app.get("/api/users", (req: Request, res: Response) => {
  res.json({ success: true, users: db.users });
});

app.patch("/api/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.users.findIndex((u) => u.id === id);
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...req.body };
    res.json({ success: true, user: db.users[index] });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

app.delete("/api/users/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  db.users = db.users.filter((u) => u.id !== id);
  res.json({ success: true, message: "User deleted" });
});

// ==========================================
// CORE AI INTEGRATION ENDPOINTS (GEMINI API)
// ==========================================

app.post("/api/ai/chat", async (req: Request, res: Response) => {
  const { message, conversationHistory = [] } = req.body;
  db.aiUsage.totalRequests++;
  db.aiUsage.chatRequests++;

  const ai = getAIClient();

  if (ai) {
    try {
      const systemPrompt = `You are "AI Student Assistant", a world-class academic tutor and learning mentor.
Provide clear, pedagogically sound, encouraging, and structured explanations.
Format your answer with clear markdown headings, bullet points, intuitive real-world analogies, and formatted code blocks if applicable.
Conclude with 2-3 high-value exam key points or follow-up discussion prompts.`;

      let promptText = `${systemPrompt}\n\n`;
      if (conversationHistory.length > 0) {
        promptText += "Recent Conversation Context:\n";
        conversationHistory.slice(-4).forEach((msg: any) => {
          promptText += `${msg.sender === "user" ? "Student" : "Tutor"}: ${msg.text}\n`;
        });
        promptText += "\n";
      }
      promptText += `Student Question: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: promptText,
      });

      const responseText = response.text || "I processed your question. Here is the academic summary.";
      db.aiUsage.estimatedTokens += Math.round(responseText.length / 4) + 120;

      // Add to history
      db.history.unshift({
        id: `hist_${Date.now()}`,
        userId: "usr_student_1",
        actionType: "asked_ai",
        title: `Asked AI: "${message.slice(0, 45)}${message.length > 45 ? "..." : ""}"`,
        subtitle: "AI Tutor Conversation",
        timestamp: "Just now",
      });

      return res.json({ success: true, text: responseText, source: "gemini-3.8-flash" });
    } catch (error: any) {
      console.error("Gemini API Error in /api/ai/chat:", error);
      db.aiUsage.apiErrors++;
    }
  }

  // High quality fallback tutor response if key is absent or network fails
  const fallbackResponse = `### Understanding: ${message}

Here is a structured academic explanation:

#### 1. Core Concept
In computer science and modern systems, this topic addresses fundamental data representation, coordination, and computational efficiency. When breaking it down:
- **Primary Mechanism**: Ensures predictable execution invariants while minimizing algorithmic overhead.
- **Key Analogy**: Imagine an organized library where items are indexed by catalog numbers rather than searched linearly.

#### 2. Practical Example
\`\`\`python
def process_data(items):
    # Optimized state evaluation
    memo = {}
    for item in items:
        if item not in memo:
            memo[item] = calculate_cost(item)
    return memo
\`\`\`

#### 3. Key Points to Remember for Exams
- Always verify edge cases (null inputs, boundary conditions).
- Time complexity typically amortizes to **O(log N)** or **O(N)** depending on index balancing.
- Be prepared to discuss trade-offs between memory footprint and latency.`;

  return res.json({ success: true, text: fallbackResponse, source: "curriculum-engine" });
});

// Generate Notes Endpoint
app.post("/api/ai/generate-notes", async (req: Request, res: Response) => {
  const { topic, subject, difficulty = "Intermediate", style = "Detailed Notes", numSections = 3 } = req.body;
  db.aiUsage.totalRequests++;
  db.aiUsage.notesGenerated++;

  const ai = getAIClient();
  let generatedContent: any = null;

  if (ai) {
    try {
      const prompt = `You are an elite professor creating study notes for university students.
Topic: "${topic}"
Subject: "${subject}"
Difficulty: "${difficulty}"
Note Style: "${style}"
Sections: ${numSections}

Respond with a JSON object adhering to this structure:
{
  "title": "${topic} Comprehensive Notes",
  "introduction": "A thorough 2-3 sentence overview introducing the subject matter and importance.",
  "mainConcepts": "Detailed markdown explanation with headings, comparisons, and code/diagram descriptions.",
  "keyPoints": ["Bullet point 1", "Bullet point 2", "Bullet point 3", "Bullet point 4"],
  "importantDefinitions": [
    {"term": "Term 1", "definition": "Precise definition"},
    {"term": "Term 2", "definition": "Precise definition"}
  ],
  "examPoints": ["Exam tip 1", "Common pitfall to avoid 2"],
  "summary": "Concise summary wrapping up the key takeaway.",
  "possibleQuestions": ["Exam question 1?", "Conceptual question 2?"]
}

Return ONLY valid JSON. No surrounding markdown backticks.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim();
      if (text) {
        generatedContent = JSON.parse(text);
      }
    } catch (e) {
      console.error("Gemini Note Generation Error:", e);
      db.aiUsage.apiErrors++;
    }
  }

  if (!generatedContent) {
    generatedContent = {
      title: `${topic} - Detailed Study Guide`,
      introduction: `${topic} is a critical concept in ${subject || "Computer Science"}. Mastering it provides foundation for building efficient, reliable systems and scoring high in technical examinations.`,
      mainConcepts: `### 1. Fundamental Principles of ${topic}
${topic} revolves around organizing data structures and system controls to guarantee invariant safety and minimal latency.

### 2. Operational Mechanics
- **Step 1**: Identify the system constraints and initial boundary values.
- **Step 2**: Apply divide-and-conquer or dynamic memoization to reduce redundant sub-problems.
- **Step 3**: Validate convergence criteria and clean up unreferenced allocations.

\`\`\`typescript
// Architectural implementation pattern
function evaluateSystem(input: string): boolean {
  if (!input) return false;
  return validateStateTransition(input);
}
\`\`\``,
      keyPoints: [
        `Understand the asymptotic time and space trade-offs for ${topic}.`,
        "Differentiate between average-case and worst-case execution paths.",
        "Always memorize standard recurrence relations and proof steps.",
        "Ensure edge cases like zero length and cyclical dependencies are handled.",
      ],
      importantDefinitions: [
        { term: "Invariant Condition", definition: "A condition that remains true throughout the execution of a given algorithm or loop." },
        { term: "Asymptotic Bound", definition: "The mathematical growth rate of resource consumption as the input size n approaches infinity." },
      ],
      examPoints: [
        "Frequently asked as a 10-mark derivation question in university semester examinations.",
        "Always illustrate your answer with a neat state-transition diagram or tree sketch.",
      ],
      summary: `${topic} establishes the backbone of modern computational efficiency in ${subject || "this course"}. Consistent practice with numerical problems is essential for high marks.`,
      possibleQuestions: [
        `What are the necessary preconditions for applying ${topic}?`,
        `How does ${topic} compare against alternative brute-force methodologies?`,
      ],
    };
  }

  const newNote = {
    id: `note_${Date.now()}`,
    userId: "usr_student_1",
    subjectId: "sub_1",
    subjectName: subject || "Computer Science",
    title: generatedContent.title || `${topic} Notes`,
    topic,
    difficulty,
    style,
    content: `# ${generatedContent.title}\n\n${generatedContent.introduction}\n\n${generatedContent.mainConcepts}`,
    keyPoints: generatedContent.keyPoints || [],
    importantDefinitions: generatedContent.importantDefinitions || [],
    examPoints: generatedContent.examPoints || [],
    summary: generatedContent.summary || "",
    possibleQuestions: generatedContent.possibleQuestions || [],
    isBookmarked: false,
    createdAt: new Date().toISOString(),
  };

  db.notes.unshift(newNote);
  db.history.unshift({
    id: `hist_${Date.now()}`,
    userId: "usr_student_1",
    actionType: "generated_notes",
    title: `Generated Notes: "${topic}"`,
    subtitle: `${subject} • ${style}`,
    timestamp: "Just now",
  });

  res.json({ success: true, note: newNote });
});

// PDF Summarization Endpoint
app.post("/api/ai/summarize-pdf", async (req: Request, res: Response) => {
  const { filename, fileContentText, summaryLength = "Medium" } = req.body;
  db.aiUsage.totalRequests++;
  db.aiUsage.pdfSummaries++;

  const ai = getAIClient();
  let result: any = null;

  if (ai && fileContentText) {
    try {
      const prompt = `You are a specialized document intelligence tutor analyzing an academic PDF/text document.
Document Name: "${filename}"
Summary Length: "${summaryLength}"
Document Content Sample:
${fileContentText.slice(0, 8000)}

Generate a structured JSON output with:
{
  "summary": "A cohesive 3-5 sentence academic executive summary of the document content.",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "importantTerms": [
    {"term": "Term 1", "definition": "Clear concise definition"},
    {"term": "Term 2", "definition": "Clear concise definition"}
  ],
  "examFocus": ["High priority exam topic 1", "Formulas or key distinctions to memorize"],
  "questions": ["Possible test question 1?", "Analytical question 2?"]
}

Return ONLY clean valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim();
      if (text) {
        result = JSON.parse(text);
      }
    } catch (e) {
      console.error("Gemini PDF Summarization Error:", e);
      db.aiUsage.apiErrors++;
    }
  }

  if (!result) {
    result = {
      summary: `This document ("${filename}") focuses on foundational principles, system architectures, and critical algorithmic patterns. It discusses theoretical definitions, implementation mechanics, protocol specifications, and evaluation benchmarks necessary for mastery in the subject.`,
      keyPoints: [
        "Establishes theoretical foundations and terminology used throughout current university syllabi.",
        "Emphasizes optimization techniques, trade-offs, and resilience against common failure modes.",
        "Details step-by-step algorithms with asymptotic complexity guarantees.",
        "Provides architectural case studies contrasting legacy techniques with modern best practices.",
      ],
      importantTerms: [
        { term: "Protocol Specification", definition: "A formalized set of rules and standards defining how data is formatted and transmitted." },
        { term: "Throughput Capacity", definition: "The total rate at which information or work is processed through a given channel per unit time." },
        { term: "Asynchronous Coordination", definition: "A computing paradigm where operations proceed independently without waiting for synchronous handshakes." },
      ],
      examFocus: [
        "Master the 5 core bullet points outlined in Chapter 3 for descriptive examination questions.",
        "Practice drawing block diagrams and protocol exchange flows.",
      ],
      questions: [
        "What are the major performance bottlenecks identified in the document?",
        "Compare the proposed optimization algorithm against traditional baseline approaches.",
      ],
    };
  }

  const newDoc = {
    id: `doc_${Date.now()}`,
    userId: "usr_student_1",
    filename: filename || "Uploaded_Lecture_Notes.pdf",
    fileSize: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
    fileType: "application/pdf",
    summary: result.summary,
    keyPoints: result.keyPoints,
    importantTerms: result.importantTerms,
    examFocus: result.examFocus,
    questions: result.questions,
    createdAt: new Date().toISOString(),
  };

  db.documents.unshift(newDoc);
  db.history.unshift({
    id: `hist_${Date.now()}`,
    userId: "usr_student_1",
    actionType: "summarized_pdf",
    title: `Summarized: "${filename}"`,
    subtitle: "AI PDF Document Intelligence",
    timestamp: "Just now",
  });

  res.json({ success: true, document: newDoc });
});

// Document follow-up Q&A
app.post("/api/ai/document-qa", async (req: Request, res: Response) => {
  const { documentId, question } = req.body;
  const doc = db.documents.find((d) => d.id === documentId) || db.documents[0];
  db.aiUsage.totalRequests++;

  const ai = getAIClient();
  if (ai) {
    try {
      const prompt = `You are an AI document assistant. Answer the student's question based on the document summary and key concepts.
Document Name: "${doc?.filename}"
Document Summary: "${doc?.summary}"
Key Points: ${JSON.stringify(doc?.keyPoints)}

Student Question: "${question}"

Provide a clear, accurate, and direct response referencing the document context.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return res.json({ success: true, answer: response.text || "Based on the document, this is a central concept." });
    } catch (e) {
      console.error("Gemini Doc Q&A error:", e);
    }
  }

  return res.json({
    success: true,
    answer: `Based on the document "${doc?.filename}": The text emphasizes that ${question.toLowerCase().includes("why") ? "the mechanism is designed to prevent resource starvation and guarantee consistency" : "this is handled through layered protocols and iterative state verification"}. Please check Chapter 2 and the summary key points for specific numerical parameters.`,
  });
});

// Quiz Generator Endpoint
app.post("/api/ai/generate-quiz", async (req: Request, res: Response) => {
  const { topic, subject, totalQuestions = 5, difficulty = "Intermediate", questionType = "MCQ" } = req.body;
  db.aiUsage.totalRequests++;
  db.aiUsage.quizzesGenerated++;

  const ai = getAIClient();
  let questions: any[] = [];

  if (ai) {
    try {
      const prompt = `Generate a university-level quiz with exactly ${totalQuestions} questions.
Topic: "${topic}"
Subject: "${subject}"
Difficulty: "${difficulty}"
Question Type: "${questionType}"

Return a JSON object adhering to this schema:
{
  "title": "${topic} Assessment Quiz",
  "questions": [
    {
      "id": "q1",
      "question": "Clear, challenging question prompt?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctAnswer": "The exact matching text of the correct option",
      "explanation": "Thorough educational explanation explaining why this option is correct and others are incorrect."
    }
  ]
}

Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      if (parsed.questions && parsed.questions.length > 0) {
        questions = parsed.questions;
      }
    } catch (e) {
      console.error("Gemini Quiz Generation Error:", e);
      db.aiUsage.apiErrors++;
    }
  }

  if (questions.length === 0) {
    // Generate realistic subject-specific questions
    questions = [
      {
        id: "q1",
        question: `Which fundamental principle is central to understanding ${topic}?`,
        options: [
          `Divide-and-conquer state minimization in ${topic}`,
          "Unbounded greedy search without termination checks",
          "Linear brute-force array traversal",
          "Randomized probabilistic shuffling",
        ],
        correctAnswer: `Divide-and-conquer state minimization in ${topic}`,
        explanation: `${topic} fundamentally optimizes computational throughput by organizing sub-problems into structured invariants.`,
      },
      {
        id: "q2",
        question: `What is the primary trade-off when implementing ${topic} at enterprise scale?`,
        options: [
          "Memory footprint vs latency",
          "Network bandwidth vs screen refresh rate",
          "File system inodes vs font sizes",
          "GPU shader threads vs disk sector count",
        ],
        correctAnswer: "Memory footprint vs latency",
        explanation: "Engineering implementations of this concept typically trade space for faster lookup and amortized runtime.",
      },
      {
        id: "q3",
        question: `Under what circumstance would a developer or engineer avoid using ${topic}?`,
        options: [
          "When the dataset is strictly microscopic and the setup overhead exceeds brute-force cost",
          "When hardware is extraordinarily powerful",
          "When operating in a 64-bit operating system",
          "When writing asynchronous TypeScript code",
        ],
        correctAnswer: "When the dataset is strictly microscopic and the setup overhead exceeds brute-force cost",
        explanation: "Algorithmic structures carry fixed overhead; for trivial datasets, simpler linear approaches often have lower constant factors.",
      },
      {
        id: "q4",
        question: `Which data structure is most complementary to ${topic}?`,
        options: [
          "Balanced Binary Search Trees or Priority Queues",
          "Single-element circular rings",
          "Raw unindexed flat files",
          "Static read-only tape buffers",
        ],
        correctAnswer: "Balanced Binary Search Trees or Priority Queues",
        explanation: "Priority queues and balanced trees provide logarithmic bounds that complement the operational needs of this topic.",
      },
      {
        id: "q5",
        question: "What is the standard invariant that must be maintained during updates?",
        options: [
          "Consistency and acyclic ordering across all dependent nodes",
          "Arbitrary pointer reassignment without locks",
          "Always doubling memory capacity on each read",
          "Resetting root references on every iteration",
        ],
        correctAnswer: "Consistency and acyclic ordering across all dependent nodes",
        explanation: "Maintaining cycle-free topological order prevents deadlocks and undefined execution states.",
      },
    ].slice(0, Number(totalQuestions) || 5);
  }

  const newQuiz = {
    id: `quiz_${Date.now()}`,
    userId: "usr_student_1",
    subjectId: "sub_1",
    subjectName: subject || "Computer Science",
    title: `${topic} Mastery Quiz`,
    topic,
    difficulty,
    questionType,
    totalQuestions: questions.length,
    questions,
    createdAt: new Date().toISOString(),
  };

  res.json({ success: true, quiz: newQuiz });
});

// Quiz Submission & AI Feedback Endpoint
app.post("/api/ai/submit-quiz", async (req: Request, res: Response) => {
  const { quizId, answers, timeTakenSeconds } = req.body;
  const quiz = db.quizzes.find((q) => q.id === quizId) || db.quizzes[0];

  let correctCount = 0;
  const reviewedQuestions = quiz.questions.map((q: any) => {
    const userAns = answers[q.id];
    const isCorrect = userAns && userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    if (isCorrect) correctCount++;
    return { ...q, userAnswer: userAns, isCorrect };
  });

  const total = quiz.questions.length || 5;
  const scorePercent = Math.round((correctCount / total) * 100);

  const ai = getAIClient();
  let aiFeedback = {
    strengths: [
      `Strong grasp of fundamental concepts in ${quiz.topic}`,
      "Accurate identification of primary operational trade-offs",
    ],
    weaknesses: [
      scorePercent < 100 ? "Edge-case bounds and mathematical formula derivation" : "None detected in this round!",
    ],
    recommendations: [
      scorePercent < 70
        ? `Review the generated notes on ${quiz.topic} before attempting another quiz`
        : `Challenge yourself with Advanced difficulty questions in ${quiz.subjectName}`,
      "Practice step-by-step problem derivations to lock in long-term memory",
    ],
    summary:
      scorePercent >= 80
        ? `Impressive work! You scored ${scorePercent}%. Your conceptual foundation is solid.`
        : `Good effort! You scored ${scorePercent}%. Focus on the recommended revision topics to elevate your score to 90%+.`,
  };

  if (ai) {
    try {
      const feedbackPrompt = `A student took a university quiz on "${quiz.topic}" (${quiz.subjectName}).
Score: ${correctCount}/${total} (${scorePercent}%)
Time taken: ${timeTakenSeconds} seconds.

Generate concise, encouraging, and actionable AI feedback in JSON:
{
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Area for improvement 1"],
  "recommendations": ["Actionable study step 1", "Actionable study step 2"],
  "summary": "2-sentence encouraging summary tailored to the score."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: feedbackPrompt,
        config: { responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(response.text || "{}");
      if (parsed.strengths) aiFeedback = parsed;
    } catch (e) {
      console.warn("AI Feedback fallback used:", e);
    }
  }

  const completedQuiz = {
    ...quiz,
    questions: reviewedQuestions,
    score: scorePercent,
    correctAnswersCount: correctCount,
    timeTakenSeconds: timeTakenSeconds || 180,
    aiFeedback,
    completedAt: new Date().toISOString(),
  };

  db.quizzes.unshift(completedQuiz);
  db.history.unshift({
    id: `hist_${Date.now()}`,
    userId: "usr_student_1",
    actionType: "completed_quiz",
    title: `Completed Quiz: "${quiz.title}"`,
    subtitle: `Score: ${scorePercent}% (${correctCount}/${total} correct)`,
    timestamp: "Just now",
  });

  res.json({ success: true, result: completedQuiz });
});

// Study Planner AI Endpoint
app.post("/api/ai/generate-study-plan", async (req: Request, res: Response) => {
  const { examDate, dailyHours = 4, subjectsKnowledge = [], targetScore = 90 } = req.body;
  db.aiUsage.totalRequests++;
  db.aiUsage.studyPlansGenerated++;

  const ai = getAIClient();
  let schedule: any[] = [];

  if (ai) {
    try {
      const prompt = `You are an expert AI academic counselor.
Create a high-impact, realistic study schedule prioritizing weak subjects.
Exam Date: ${examDate}
Daily Hours: ${dailyHours} hours/day
Target Score: ${targetScore}%
Subjects & Current Proficiency: ${JSON.stringify(subjectsKnowledge)}

Generate a JSON object:
{
  "title": "High-Impact Personalized Exam Masterplan",
  "schedule": [
    {
      "id": "item_1",
      "day": "Monday",
      "time": "09:00 AM - 10:30 AM",
      "subject": "Weakest Subject Name",
      "topic": "Specific Difficult Topic",
      "activity": "Detailed study activity (e.g., Theory revision + 3 practice problems)",
      "duration": "90 mins",
      "completed": false
    }
  ]
}
Include 6-8 structured sessions across the week.
Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(response.text || "{}");
      if (parsed.schedule && parsed.schedule.length > 0) {
        schedule = parsed.schedule;
      }
    } catch (e) {
      console.error("Gemini Study Planner Error:", e);
      db.aiUsage.apiErrors++;
    }
  }

  if (schedule.length === 0) {
    // Sort subjects by lowest proficiency first
    const sorted = [...(subjectsKnowledge.length ? subjectsKnowledge : [
      { subject: "Operating Systems", proficiency: 45 },
      { subject: "Computer Networks", proficiency: 40 },
      { subject: "Database Management Systems", proficiency: 68 },
      { subject: "Data Structures & Algorithms", proficiency: 80 },
    ])].sort((a: any, b: any) => a.proficiency - b.proficiency);

    const weak1 = sorted[0]?.subject || "Operating Systems";
    const weak2 = sorted[1]?.subject || "Computer Networks";
    const strong1 = sorted[sorted.length - 1]?.subject || "Data Structures & Algorithms";

    schedule = [
      {
        id: `item_${Date.now()}_1`,
        day: "Monday",
        time: "09:00 AM - 10:30 AM",
        subject: weak1,
        topic: "Core Foundations & Weak Topic Remediation",
        activity: "Deep Dive Lecture Notes & Diagram Analysis",
        duration: "90 mins",
        completed: false,
      },
      {
        id: `item_${Date.now()}_2`,
        day: "Monday",
        time: "11:00 AM - 12:30 PM",
        subject: weak2,
        topic: "Protocol Mechanics & Numerical Problems",
        activity: "Formulas & 5 Practice Problems",
        duration: "90 mins",
        completed: false,
      },
      {
        id: `item_${Date.now()}_3`,
        day: "Tuesday",
        time: "09:00 AM - 10:30 AM",
        subject: weak1,
        topic: "Banker's Safety & Memory Virtualization",
        activity: "Algorithmic Code Walkthrough & Mock Quiz",
        duration: "90 mins",
        completed: false,
      },
      {
        id: `item_${Date.now()}_4`,
        day: "Tuesday",
        time: "02:00 PM - 03:30 PM",
        subject: strong1,
        topic: "Advanced Graph Algorithms & Dynamic Programming",
        activity: "Speed Quiz & Flashcard Review",
        duration: "90 mins",
        completed: false,
      },
      {
        id: `item_${Date.now()}_5`,
        day: "Wednesday",
        time: "09:00 AM - 10:30 AM",
        subject: weak2,
        topic: "TCP vs UDP & Congestion Control Mechanics",
        activity: "Document Summarization & Q&A Review",
        duration: "90 mins",
        completed: false,
      },
      {
        id: `item_${Date.now()}_6`,
        day: "Thursday",
        time: "10:00 AM - 12:00 PM",
        subject: "Comprehensive Revision",
        topic: "Full Mock Assessment & Weak Area Patching",
        activity: "Timed 50-Question Practice Test",
        duration: "120 mins",
        completed: false,
      },
    ];
  }

  const newPlan = {
    id: `plan_${Date.now()}`,
    userId: "usr_student_1",
    title: "AI Optimized Exam Success Plan",
    examDate: examDate || "2026-04-15",
    dailyHours,
    targetScore,
    subjectsKnowledge,
    schedule,
    createdAt: new Date().toISOString(),
  };

  db.studyPlans.unshift(newPlan);
  res.json({ success: true, plan: newPlan });
});

// AI Recommendations Engine
app.get("/api/ai/recommendations", (req: Request, res: Response) => {
  // Hybrid rule-based + AI recommendation logic
  const recommendations = [
    {
      id: "rec_1",
      title: "Revise Binary Trees & AVL Rotations",
      subject: "Data Structures & Algorithms",
      reason: "Your recent quiz had an error on AVL minimum node calculations (Recurrence relations).",
      actionLabel: "Study Now",
      actionType: "note",
      priority: "high",
    },
    {
      id: "rec_2",
      title: "Practice SQL Indexing Queries",
      subject: "Database Management Systems",
      reason: "You have not reviewed DBMS concepts in 5 days, and your last activity was B+ Tree Indexing.",
      actionLabel: "Practice Quiz",
      actionType: "quiz",
      priority: "medium",
    },
    {
      id: "rec_3",
      title: "Take an Operating Systems Diagnostic Quiz",
      subject: "Operating Systems",
      reason: "Your current subject progress is 55% with Deadlock topics pending.",
      actionLabel: "Start Quiz",
      actionType: "quiz",
      priority: "high",
    },
    {
      id: "rec_4",
      title: "Summarize Computer Networks Lecture PDF",
      subject: "Computer Networks",
      reason: "Computer Networks progress is at 45%. Uploading the syllabus notes will boost retention.",
      actionLabel: "Upload Document",
      actionType: "planner",
      priority: "medium",
    },
  ];

  res.json({ success: true, recommendations });
});

// Teacher AI Content Generator
app.post("/api/ai/teacher-content", async (req: Request, res: Response) => {
  const { topic, subject, difficulty = "Intermediate", contentType = "MCQs", count = 10 } = req.body;
  db.aiUsage.totalRequests++;

  const ai = getAIClient();
  let generatedData: any = null;

  if (ai) {
    try {
      const prompt = `You are an elite university faculty curriculum designer.
Subject: "${subject}"
Topic: "${topic}"
Difficulty: "${difficulty}"
Content Type: "${contentType}"
Count: ${count}

Generate high-quality curriculum teaching material in JSON format:
{
  "topic": "${topic}",
  "subject": "${subject}",
  "contentType": "${contentType}",
  "items": [
    {
      "title": "Item title or question",
      "content": "Detailed content, question options, answer key, or rubric",
      "guidance": "Pedagogical guidance for the teacher"
    }
  ],
  "learningOutcomes": ["Outcome 1", "Outcome 2"]
}
Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      generatedData = JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Gemini Teacher Content Generator Error:", e);
    }
  }

  if (!generatedData) {
    generatedData = {
      topic,
      subject,
      contentType,
      learningOutcomes: [
        `Master fundamental mathematical models of ${topic}`,
        "Analyze enterprise edge cases and trade-offs under real-world constraints",
      ],
      items: [
        {
          title: `Diagnostic Exercise 1: ${topic} Mechanics`,
          content: `Present students with a system state trace of ${topic}. Ask them to identify the bottleneck and calculate theoretical throughput limits.`,
          guidance: "Ideal for 15-minute in-class group breakout sessions.",
        },
        {
          title: `Assignment Problem 2: Formal Proof of Correctness`,
          content: `Prove by mathematical induction that the ${topic} invariant holds across all state transitions.`,
          guidance: "Include this in the upcoming mid-semester assessment.",
        },
        {
          title: `Discussion Topic: Scalability vs Reliability Trade-off`,
          content: `Under what constraints does ${topic} fail to deliver sub-second response times?`,
          guidance: "Use this to initiate seminar debate on CAP theorem applications.",
        },
      ],
    };
  }

  res.json({ success: true, data: generatedData });
});

// ==========================================
// RELATIONAL DATA ENDPOINTS
// ==========================================

app.get("/api/subjects", (req: Request, res: Response) => {
  res.json({ success: true, subjects: db.subjects });
});

app.post("/api/subjects", (req: Request, res: Response) => {
  const newSub = {
    id: `sub_${Date.now()}`,
    name: req.body.name || "New Subject",
    code: req.body.code || "CS101",
    description: req.body.description || "Course description",
    teacherId: req.body.teacherId || "usr_teacher_1",
    teacherName: req.body.teacherName || "Prof. Priya Sharma",
    topicsCount: req.body.topicsCount || 15,
    completedTopics: 0,
    progress: 0,
    averageScore: 0,
    color: "from-blue-500 to-indigo-600",
    iconName: "BookOpen",
  };
  db.subjects.push(newSub);
  res.json({ success: true, subject: newSub });
});

app.get("/api/notes", (req: Request, res: Response) => {
  res.json({ success: true, notes: db.notes });
});

app.post("/api/notes", (req: Request, res: Response) => {
  const newNote = {
    id: `note_${Date.now()}`,
    userId: "usr_student_1",
    subjectId: req.body.subjectId || "sub_1",
    subjectName: req.body.subjectName || "Computer Science",
    title: req.body.title || "Untitled Note",
    topic: req.body.topic || "General",
    difficulty: req.body.difficulty || "Intermediate",
    style: req.body.style || "Detailed Notes",
    content: req.body.content || "",
    keyPoints: req.body.keyPoints || [],
    summary: req.body.summary || "",
    isBookmarked: false,
    createdAt: new Date().toISOString(),
  };
  db.notes.unshift(newNote);
  res.json({ success: true, note: newNote });
});

app.delete("/api/notes/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  db.notes = db.notes.filter((n) => n.id !== id);
  res.json({ success: true });
});

app.get("/api/documents", (req: Request, res: Response) => {
  res.json({ success: true, documents: db.documents });
});

app.delete("/api/documents/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  db.documents = db.documents.filter((d) => d.id !== id);
  res.json({ success: true });
});

app.get("/api/quizzes", (req: Request, res: Response) => {
  res.json({ success: true, quizzes: db.quizzes });
});

app.get("/api/study-plans", (req: Request, res: Response) => {
  res.json({ success: true, plans: db.studyPlans });
});

app.patch("/api/study-plans/:planId/items/:itemId", (req: Request, res: Response) => {
  const { planId, itemId } = req.params;
  const plan = db.studyPlans.find((p) => p.id === planId);
  if (plan) {
    const item = plan.schedule.find((i: any) => i.id === itemId);
    if (item) {
      item.completed = req.body.completed !== undefined ? req.body.completed : !item.completed;
      return res.json({ success: true, item });
    }
  }
  res.status(404).json({ success: false, message: "Item not found" });
});

app.get("/api/bookmarks", (req: Request, res: Response) => {
  res.json({ success: true, bookmarks: db.bookmarks });
});

app.post("/api/bookmarks", (req: Request, res: Response) => {
  const { contentType, contentId, title, snippet, subjectName } = req.body;
  const existing = db.bookmarks.find((b) => b.contentId === contentId);
  if (existing) {
    db.bookmarks = db.bookmarks.filter((b) => b.contentId !== contentId);
    return res.json({ success: true, action: "removed" });
  }
  const newBm = {
    id: `bm_${Date.now()}`,
    userId: "usr_student_1",
    contentType: contentType || "note",
    contentId,
    title: title || "Saved Item",
    snippet: snippet || "",
    subjectName: subjectName || "General",
    createdAt: new Date().toISOString(),
  };
  db.bookmarks.unshift(newBm);
  res.json({ success: true, action: "added", bookmark: newBm });
});

app.get("/api/notifications", (req: Request, res: Response) => {
  res.json({ success: true, notifications: db.notifications });
});

app.patch("/api/notifications/:id/read", (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) notif.isRead = true;
  res.json({ success: true });
});

app.post("/api/notifications/read-all", (req: Request, res: Response) => {
  db.notifications.forEach((n) => (n.isRead = true));
  res.json({ success: true });
});

app.get("/api/assignments", (req: Request, res: Response) => {
  res.json({ success: true, assignments: db.assignments, submissions: db.submissions });
});

app.post("/api/assignments", (req: Request, res: Response) => {
  const newAsg = {
    id: `asg_${Date.now()}`,
    teacherId: "usr_teacher_1",
    subjectId: req.body.subjectId || "sub_1",
    subjectName: req.body.subjectName || "Computer Science",
    title: req.body.title || "New Assignment",
    description: req.body.description || "",
    deadline: req.body.deadline || new Date(Date.now() + 86400000 * 7).toISOString(),
    totalStudents: 42,
    submittedCount: 0,
    createdAt: new Date().toISOString(),
  };
  db.assignments.unshift(newAsg);
  res.json({ success: true, assignment: newAsg });
});

app.post("/api/assignments/:id/submit", (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, studentName } = req.body;
  const newSubm = {
    id: `subm_${Date.now()}`,
    assignmentId: id,
    studentId: "usr_student_1",
    studentName: studentName || "Alex Johnson",
    studentEmail: "alex.student@university.edu",
    content: content || "Completed submission content.",
    status: "submitted",
    submittedAt: new Date().toISOString(),
  };
  db.submissions.unshift(newSubm);
  const asg = db.assignments.find((a) => a.id === id);
  if (asg) asg.submittedCount++;
  res.json({ success: true, submission: newSubm });
});

app.get("/api/progress", (req: Request, res: Response) => {
  const studentProgress = {
    overallProgress: 72,
    studyHoursTotal: 48.5,
    topicsCompleted: 52,
    quizzesCompleted: 14,
    currentStreakDays: 6,
    averageQuizScore: 82,
    notesCreated: 18,
    weeklyHours: [
      { day: "Mon", hours: 4.5, quizzes: 2 },
      { day: "Tue", hours: 6.0, quizzes: 3 },
      { day: "Wed", hours: 3.5, quizzes: 1 },
      { day: "Thu", hours: 5.5, quizzes: 2 },
      { day: "Fri", hours: 7.0, quizzes: 4 },
      { day: "Sat", hours: 4.0, quizzes: 1 },
      { day: "Sun", hours: 2.5, quizzes: 1 },
    ],
    subjectPerformances: [
      { subject: "Data Structures", score: 84, progress: 80 },
      { subject: "Operating Systems", score: 68, progress: 55 },
      { subject: "DBMS", score: 78, progress: 68 },
      { subject: "Computer Networks", score: 62, progress: 45 },
    ],
    aiInsight: "You are performing strongly in Data Structures & Algorithms (84%), but Operating Systems and Computer Networks need immediate focused attention prior to the upcoming semester finals.",
  };
  res.json({ success: true, progress: studentProgress });
});

app.get("/api/history", (req: Request, res: Response) => {
  res.json({ success: true, history: db.history });
});

app.get("/api/ai/usage", (req: Request, res: Response) => {
  res.json({ success: true, usage: db.aiUsage });
});

// Global Search Endpoint
app.get("/api/search", (req: Request, res: Response) => {
  const q = ((req.query.q as string) || "").toLowerCase().trim();
  if (!q) return res.json({ success: true, results: { subjects: [], notes: [], quizzes: [], documents: [] } });

  const subjects = db.subjects.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
  const notes = db.notes.filter((n) => n.title.toLowerCase().includes(q) || n.topic.toLowerCase().includes(q));
  const quizzes = db.quizzes.filter((qz) => qz.title.toLowerCase().includes(q) || qz.topic.toLowerCase().includes(q));
  const documents = db.documents.filter((d) => d.filename.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q));

  res.json({ success: true, results: { subjects, notes, quizzes, documents } });
});

// ==========================================
// VITE MIDDLEWARE & SERVER STARTUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Student Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
