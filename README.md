**Recall: The AI-Native Knowledge Base**  
Recall is a next-generation, AI-first note-taking and knowledge management system. Designed from the ground up to eliminate the friction of organizing information, Recall acts as a second brain that automatically understands, categorizes, and connects your thoughts.  
**🚀 How It Works**  
Traditional note-taking apps force you to manually organize, tag, and link your files. Recall completely reverses this paradigm.  
1. **Effortless Input**: Paste text, type a meeting note, or upload documents (PDFs, Word Docs, Images).  
2. **AI Processing Pipeline**: The moment you input data, Recall's backend AI models take over.  
  - **Auto-Title & Summary**: Generates a concise title and a one-line summary.  
  - **Entity & Concept Extraction**: Identifies key concepts and automatically tags the note.  
  - **Semantic Embedding**: Converts the text into vector embeddings and stores them in a high-speed PostgreSQL database.  
3. **Automatic Connections**: Recall analyzes the semantic meaning of your new note and automatically graphs relationships with existing notes in your knowledge base.  
**🌟 Key Features**  
- **"Ask AI" (RAG)**: Chat directly with your entire knowledge base. Ask questions, and Recall will perform a vector search across your notes to synthesize accurate, context-aware answers.  
- **Smart Document Parsing**: Natively extracts text and tables from PDFs, .docx files, and images (using Vision AI models).  
- **Semantic Connections Graph**: Visually explore how different concepts in your vault relate to one another based on true semantic meaning, not just exact keyword matches.  
- **Local Vault Export**: Own your data securely. Download your entire cloud database instantly as a local folder of raw Markdown (.md) files—complete with YAML frontmatter tags—fully compatible with local editors.  
- **Beautiful, Modern UI**: Enjoy a stunning, responsive interface with smooth micro-animations, expressive glassmorphism, and seamless Dark/Light modes.  
**⚔️ Recall vs. Competitors**  
| | | |  
|-|-|-|  
| **Feature** | **Recall** | ** Traditional Apps** |   
| **Architecture** | AI-Native, Database-First (PostgreSQL + pgvector) | Text Editor, Local File-First |   
| **Organization** | Automatic tagging, titling, and summarization | Manual folder creation and tagging |   
| **Search Capabilities** | High-speed Vector Semantic Search & Complex SQL | Exact keyword/regex matching |   
| **AI Integration** | Deeply embedded into the core workflow | Reliant on fragmented community plugins |   
| **Setup Friction** | Zero-config, ready immediately | Requires complex plugin configuration |   
| **Data Portability** | One-click local Markdown (.md) export | Native .md files |   
   
*While local-first apps like Obsidian are excellent text editors, achieving an AI-powered "sma* *rt vault" requires stringing together third-party plugins. Recall is built natively around vector databases and LLMs to provide a frictionless, futuristic knowledge base, while still respecting data ownership through its comprehensive Local Export feature.*  
**🛠️ Technology Stack**  
Recall leverages a modern, high-performance web stack:  
**Frontend:**  
- **Next.js 14** (App Router)  
- **React**  
- **Tailwind CSS** (for layout utility) &  **Vanilla CSS Variables** (for expressive, dynamic theming)  
- **Lucide React** (Icons)  
**Backend & AI:**  
- **Node.js**  
- **OpenAI SDK / OpenRouter API**: Communicating with cutting-edge LLMs (Llama 3, DeepSeek, GPT-4o-mini for Vision).  
- **File Parsing**: pdf-parse (PDFs), mammoth (Word documents).  
**Database:**  
- **PostgreSQL**  
- **pgvector**: For storing and querying high-dimensional embedding vectors.  
- **pg (node-postgres)**: Direct, optimized database queries.  
**⚙️ Setup and Installation**  
1. **Clone & Install**:  
2. git clone <repo_url>  
 cd Recall  
 npm install  
   
3. **Database Configuration**:  
   
 Ensure you have a PostgreSQL database running with the vector extension enabled.  
   
 Execute the schema initialization script located in the lib/db.ts or database setup files.  
4. **Environment Variables**:  
   
 Create a .env file with your database URL and necessary API keys:  
5. DATABASE_URL="postgresql://user:pass@localhost:5432/recall"  
   
6. *(Note: The current configuration uses hardcoded fallback OpenRouter/Groq keys for demo purposes. In production, configure standard * *OPENAI_API_KEY* * or equivalent provider keys).*  
7. **Run Development Server**:  
8. npm run dev  
   
9. Navigate to http://localhost:3000 to access your AI knowledge base.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSPBCj5fFyM6mJHAjAU2QtIq6DIzW7UHAMBfnGt1V8fXEwAAXrsexOEF35f1aEgAAAAASUVORK5CYII=)  
*Designed for those who want their tools to do the heavy lifting.*  
