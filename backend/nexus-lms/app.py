from flask import Flask, render_template_string, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

# --- Configuration ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nexus_ultimate.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- Database Models ---
class AcademicClass(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    papers = db.relationship('Paper', backref='academic_class', lazy=True, cascade="all, delete-orphan")

class Paper(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('academic_class.id'), nullable=False)
    notes = db.relationship('Note', backref='paper', lazy=True, cascade="all, delete-orphan")

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), default="Untitled Document")
    content = db.Column(db.Text, default="") 
    summary = db.Column(db.Text, default="")
    key_concepts = db.Column(db.Text, default="") 
    paper_id = db.Column(db.Integer, db.ForeignKey('paper.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

with app.app_context():
    db.create_all()

# --- HTML Template (The Real-Time MS Word Ultimate Experience) ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexus Word Pro - Academic LMS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;600;700&display=swap');
        
        :root {
            --word-blue: #2b579a;
            --word-blue-dark: #1e3a63;
            --ribbon-bg: #f3f2f1;
            --page-bg: #e1dfdd;
            --border-color: #edebe9;
        }

        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background-color: var(--page-bg);
            color: #323130;
            overflow: hidden;
        }

        /* Office Header */
        .office-header {
            background-color: var(--word-blue);
            height: 48px;
            color: white;
            display: flex;
            align-items: center;
            padding: 0 16px;
            font-size: 14px;
            z-index: 100;
        }

        /* Ribbon Styles */
        .ribbon {
            background-color: var(--ribbon-bg);
            border-bottom: 1px solid var(--border-color);
            z-index: 90;
        }
        .ribbon-tabs {
            display: flex;
            padding-left: 20px;
            background: white;
            border-bottom: 1px solid var(--border-color);
        }
        .ribbon-tab {
            padding: 8px 16px;
            cursor: pointer;
            font-size: 13px;
            color: #323130;
            border-bottom: 2px solid transparent;
        }
        .ribbon-tab:hover { background-color: #f3f2f1; }
        .ribbon-tab.active { 
            color: var(--word-blue);
            border-bottom: 2px solid var(--word-blue);
            font-weight: 600;
        }
        .ribbon-content {
            padding: 8px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            height: 96px;
        }
        .ribbon-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            border-right: 1px solid #d2d0ce;
            padding-right: 12px;
            height: 100%;
            justify-content: center;
        }
        .ribbon-group-label {
            font-size: 10px;
            color: #605e5c;
            margin-top: 8px;
            font-weight: 600;
        }
        .ribbon-row {
            display: flex;
            gap: 2px;
            align-items: center;
        }
        
        .btn-office-large {
            @apply flex flex-col items-center justify-center p-2 rounded hover:bg-[#edebe9] transition-colors text-center;
            min-width: 56px;
        }
        .btn-office-large i { font-size: 20px; color: var(--word-blue); }
        .btn-office-large span { font-size: 11px; margin-top: 4px; color: #323130; }
        
        .tool-btn {
            @apply p-1.5 hover:bg-[#edebe9] rounded text-slate-700 text-sm flex items-center justify-center min-w-[28px] min-h-[28px];
        }
        .tool-btn:active { background: #d2d0ce; }

        /* MS Word Page */
        .word-container {
            flex: 1;
            overflow-y: auto;
            display: flex;
            justify-content: center;
            padding: 40px 0;
            scroll-behavior: smooth;
        }
        .word-page {
            background: white;
            width: 816px; 
            min-height: 1056px;
            padding: 96px; 
            box-shadow: 0 0 20px rgba(0,0,0,0.15);
            outline: none;
            cursor: text;
            position: relative;
        }

        /* Transcription Interim Result Styling */
        #interimSpan {
            color: #a1a1a1;
            font-style: italic;
        }

        @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
            .word-page {
                box-shadow: none !important;
                margin: 0 !important;
                width: 100% !important;
                padding: 0.5in !important;
            }
        }

        /* Sidebar LMS styling */
        .nav-pane {
            background: #faf9f8;
            border-right: 1px solid var(--border-color);
            width: 280px;
        }
        
        .nav-item-active {
            background: #edebe9;
            border-left: 4px solid var(--word-blue);
            font-weight: 600;
        }

        /* Editor Elements */
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        table, th, td { border: 1px solid #a1a1a1; padding: 8px; min-width: 20px; }
        img { max-width: 100%; border-radius: 4px; margin: 1em 0; display: block; }
        
        .syncing-dot {
            width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 4px;
        }
    </style>
</head>
<body class="flex flex-col h-screen">

    <!-- Top Office Blue Bar -->
    <header class="office-header no-print">
        <div class="flex items-center gap-4 flex-1">
            <i class="fas fa-th cursor-pointer hover:bg-blue-800 p-2 rounded text-lg"></i>
            <span class="font-bold tracking-tight text-white/90">Word</span>
            <div class="h-4 w-px bg-blue-400 mx-1"></div>
            <input id="noteTitle" type="text" value="Document1" 
                   class="bg-transparent border-none focus:ring-0 font-semibold text-white placeholder-blue-200 w-full max-w-lg transition-all focus:bg-blue-800/50 rounded px-2"
                   onchange="autoSave()">
        </div>
        <div class="flex items-center gap-6">
            <div class="flex items-center text-[11px] font-medium" id="syncIndicator">
                <span class="syncing-dot bg-emerald-400"></span> Synced to Cloud
            </div>
            <button onclick="window.print()" class="text-xs hover:bg-blue-800 px-3 py-1 rounded transition-colors">Share</button>
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border border-blue-300 font-bold text-xs">AS</div>
        </div>
    </header>

    <!-- Ribbon Navigation -->
    <nav class="ribbon no-print shadow-sm">
        <div class="ribbon-tabs">
            <div onclick="switchTab('file')" class="ribbon-tab" id="tab-file">File</div>
            <div onclick="switchTab('home')" class="ribbon-tab active" id="tab-home">Home</div>
            <div onclick="switchTab('insert')" class="ribbon-tab" id="tab-insert">Insert</div>
            <div onclick="switchTab('ai')" class="ribbon-tab text-indigo-700 font-bold" id="tab-ai">AI Designer</div>
        </div>

        <!-- Home Tab Content -->
        <div id="content-home" class="ribbon-content">
            <div class="ribbon-group">
                <div class="ribbon-row">
                    <button onclick="format('undo')" class="tool-btn" title="Undo"><i class="fas fa-undo"></i></button>
                    <button onclick="format('redo')" class="tool-btn" title="Redo"><i class="fas fa-redo"></i></button>
                </div>
                <div class="ribbon-group-label">Undo</div>
            </div>
            <div class="ribbon-group">
                <div class="ribbon-row">
                    <select onchange="format('fontName', this.value)" class="text-xs p-1 border border-gray-300 rounded w-36 outline-none focus:border-blue-500">
                        <option value="Segoe UI">Segoe UI</option>
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                    </select>
                    <select onchange="format('fontSize', this.value)" class="text-xs p-1 border border-gray-300 rounded outline-none focus:border-blue-500">
                        <option value="3">11</option>
                        <option value="1">8</option>
                        <option value="2">10</option>
                        <option value="4">14</option>
                        <option value="5">18</option>
                        <option value="6">24</option>
                        <option value="7">36</option>
                    </select>
                </div>
                <div class="ribbon-row">
                    <button onclick="format('bold')" class="tool-btn font-bold hover:text-blue-700" title="Bold (Ctrl+B)">B</button>
                    <button onclick="format('italic')" class="tool-btn italic hover:text-blue-700" title="Italic (Ctrl+I)">I</button>
                    <button onclick="format('underline')" class="tool-btn underline hover:text-blue-700" title="Underline (Ctrl+U)">U</button>
                    <div class="h-4 w-px bg-gray-300 mx-1"></div>
                    <button onclick="format('foreColor', prompt('Color Name/Hex:', 'red'))" class="tool-btn text-red-600" title="Font Color"><i class="fas fa-font"></i></button>
                    <button onclick="format('hiliteColor', 'yellow')" class="tool-btn bg-yellow-200" title="Highlight"><i class="fas fa-highlighter text-xs"></i></button>
                </div>
                <div class="ribbon-group-label">Font</div>
            </div>
            <div class="ribbon-group">
                <div class="ribbon-row">
                    <button onclick="format('justifyLeft')" class="tool-btn"><i class="fas fa-align-left"></i></button>
                    <button onclick="format('justifyCenter')" class="tool-btn"><i class="fas fa-align-center"></i></button>
                    <button onclick="format('justifyRight')" class="tool-btn"><i class="fas fa-align-right"></i></button>
                    <div class="h-4 w-px bg-gray-300 mx-1"></div>
                    <button onclick="format('insertUnorderedList')" class="tool-btn"><i class="fas fa-list-ul"></i></button>
                    <button onclick="format('insertOrderedList')" class="tool-btn"><i class="fas fa-list-ol"></i></button>
                </div>
                <div class="ribbon-group-label">Paragraph</div>
            </div>
            <!-- Live Voice Dictation (Accent Red for Visibility) -->
            <div class="ribbon-group !border-none">
                <button id="micBtn" onclick="toggleSpeech()" class="btn-office-large transition-all" title="Start Real-time Transcription">
                    <i class="fas fa-microphone" id="micIcon"></i>
                    <span id="micText" class="font-bold">Dictate</span>
                </button>
                <div class="ribbon-group-label">Voice</div>
            </div>
        </div>

        <!-- Insert Tab Content -->
        <div id="content-insert" class="ribbon-content hidden">
            <div class="ribbon-group">
                <button onclick="insertTable()" class="btn-office-large">
                    <i class="fas fa-table"></i>
                    <span>Table</span>
                </button>
                <div class="ribbon-group-label">Tables</div>
            </div>
            <div class="ribbon-group">
                <label class="btn-office-large cursor-pointer">
                    <i class="fas fa-image"></i>
                    <span>Pictures</span>
                    <input type="file" class="hidden" onchange="uploadImage(this)">
                </label>
                <button onclick="format('createLink', prompt('Enter Link URL:'))" class="btn-office-large">
                    <i class="fas fa-link"></i>
                    <span>Link</span>
                </button>
                <div class="ribbon-group-label">Illustrations</div>
            </div>
        </div>

        <!-- AI Tab Content -->
        <div id="content-ai" class="ribbon-content hidden">
            <div class="ribbon-group">
                <button onclick="summarizeWithAI()" class="btn-office-large">
                    <i class="fas fa-wand-magic-sparkles text-indigo-600"></i>
                    <span>Summarize</span>
                </button>
                <div class="ribbon-group-label">AI Insights</div>
            </div>
            <div class="ribbon-group">
                <button onclick="generateQuiz()" class="btn-office-large">
                    <i class="fas fa-graduation-cap text-indigo-600"></i>
                    <span>Exam Prep</span>
                </button>
                <div class="ribbon-group-label">Study Tools</div>
            </div>
        </div>
    </nav>

    <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar Navigation Pane -->
        <aside class="nav-pane no-print flex flex-col shadow-inner">
            <div class="p-5 border-b border-gray-200 bg-white">
                <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-4">Navigation Pane</h3>
                <div class="relative">
                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                    <input id="sidebarSearch" oninput="filterSidebar()" type="text" placeholder="Search my archive..." 
                           class="w-full text-xs p-2 pl-8 bg-gray-50 border border-gray-200 rounded focus:ring-1 ring-blue-500 outline-none">
                </div>
            </div>
            <div class="flex-1 overflow-y-auto p-3 no-scrollbar space-y-4" id="classList">
                <!-- Academic Classes will load here -->
            </div>
            <div class="p-4 bg-gray-50 border-t border-gray-200">
                <button onclick="promptAddClass()" class="w-full py-2 bg-white border border-gray-300 text-[10px] font-black text-gray-600 rounded shadow-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2 uppercase">
                    <i class="fas fa-plus"></i> New Project
                </button>
            </div>
        </aside>

        <!-- The Word Canvas -->
        <main class="word-container no-scrollbar" id="mainScroll">
            <div id="noteContent" contenteditable="true" class="word-page" spellcheck="false" 
                 oninput="handleEditorInput()" onkeydown="handleKeyDown(event)">
                <div class="flex flex-col items-center justify-center h-full opacity-30 select-none" id="emptyMsg">
                    <i class="fas fa-file-word text-6xl mb-4"></i>
                    <p class="text-xl font-semibold">Select a module to start writing</p>
                </div>
            </div>
        </main>

        <!-- Right Side AI Stats (Persistent) -->
        <aside class="w-72 bg-white border-l border-gray-200 no-print flex flex-col shadow-lg">
            <div class="p-5 border-b border-gray-100 flex items-center justify-between">
                <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Academic AI</span>
                <i class="fas fa-sparkles text-indigo-500 text-xs animate-pulse"></i>
            </div>
            <div class="flex-1 p-6 overflow-y-auto space-y-8 no-scrollbar">
                <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <h4 class="text-[10px] font-black text-indigo-900 uppercase mb-3 flex items-center gap-2">
                        <i class="fas fa-align-left"></i> Summary
                    </h4>
                    <p id="summaryDisplay" class="text-[11px] text-indigo-700 leading-relaxed italic">The AI summary will appear here automatically when triggered.</p>
                </div>
                
                <div>
                    <h4 class="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2">
                        <i class="fas fa-microchip"></i> Key Concepts
                    </h4>
                    <div id="conceptsDisplay" class="flex flex-wrap gap-2">
                        <span class="text-[10px] text-gray-300">Extracting context...</span>
                    </div>
                </div>

                <div class="pt-10 border-t border-gray-50">
                    <div class="text-[10px] text-gray-400 font-bold uppercase mb-2">Editor Stats</div>
                    <div class="flex justify-between text-xs font-medium py-1 border-b border-gray-50">
                        <span>Characters</span>
                        <span id="charCount">0</span>
                    </div>
                    <div class="flex justify-between text-xs font-medium py-1 border-b border-gray-50">
                        <span>Words</span>
                        <span id="wordCountStat">0</span>
                    </div>
                </div>
            </div>
        </aside>
    </div>

    <!-- Status Bar -->
    <footer class="h-7 bg-[#2b579a] text-white flex items-center justify-between px-6 text-[10px] no-print">
        <div class="flex items-center gap-6">
            <span id="wordCount">0 words</span>
            <span class="opacity-80">English (United States)</span>
            <span class="flex items-center gap-1"><i class="fas fa-shield-check text-emerald-400"></i> Proofing: Active</span>
        </div>
        <div class="flex items-center gap-4">
            <span class="font-bold">100%</span>
            <div class="flex gap-3 text-xs">
                <i class="fas fa-book-open cursor-pointer hover:text-blue-200"></i>
                <i class="fas fa-file-alt cursor-pointer hover:text-blue-200"></i>
                <i class="fas fa-columns cursor-pointer hover:text-blue-200"></i>
            </div>
        </div>
    </footer>

    <!-- Notification Toast -->
    <div id="commandToast" class="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl z-[200] flex items-center gap-4 opacity-0 pointer-events-none transition-all duration-300 translate-y-10">
        <i class="fas fa-check-circle text-emerald-400"></i>
        <span id="toastMsg" class="text-[11px] font-bold uppercase tracking-wider">Sync Successful</span>
    </div>

    <script>
        let currentPaperId = null;
        let currentNoteId = null;
        let isRecording = false;
        let sidebarData = [];
        let autoSaveTimer = null;
        const apiKey = ""; 

        // --- Editor Performance Enhancements ---
        function handleEditorInput() {
            document.getElementById('emptyMsg')?.remove();
            updateStats();
            autoSaveDebounced();
        }

        function handleKeyDown(e) {
            // Handle Tab properly in ContentEditable
            if (e.key === 'Tab') {
                e.preventDefault();
                format('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        }

        function format(cmd, val = null) {
            document.execCommand(cmd, false, val);
            document.getElementById('noteContent').focus();
            autoSaveDebounced();
        }

        function autoSaveDebounced() {
            setSyncStatus('saving');
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                saveNote();
            }, 1500); // Wait for 1.5 seconds of inactivity
        }

        function setSyncStatus(status) {
            const ind = document.getElementById('syncIndicator');
            const dot = ind.querySelector('.syncing-dot');
            if (status === 'saving') {
                ind.innerHTML = '<span class="syncing-dot bg-amber-400 animate-pulse"></span> Saving...';
            } else if (status === 'synced') {
                ind.innerHTML = '<span class="syncing-dot bg-emerald-400"></span> Synced to Cloud';
            } else {
                ind.innerHTML = '<span class="syncing-dot bg-red-400"></span> Error Syncing';
            }
        }

        // --- Real-time Voice Logic (Fast-Typing) ---
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition;
        
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true; // IMPORTANT for fast feedback
            
            recognition.onresult = (e) => {
                const editor = document.getElementById('noteContent');
                editor.focus();
                
                // Remove existing interim span if any
                document.getElementById('interimSpan')?.remove();
                
                let interimTranscript = '';
                for (let i = e.resultIndex; i < e.results.length; ++i) {
                    const transcript = e.results[i][0].transcript;
                    if (e.results[i].isFinal) {
                        // Insert final text at cursor
                        document.execCommand('insertText', false, transcript + ' ');
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                // Show interim results in real-time (gray italic text)
                if (interimTranscript) {
                    const interimSpan = document.createElement('span');
                    interimSpan.id = 'interimSpan';
                    interimSpan.innerText = interimTranscript;
                    
                    const selection = window.getSelection();
                    if (selection.rangeCount) {
                        const range = selection.getRangeAt(0);
                        range.insertNode(interimSpan);
                        // Do not change selection to keep typing natural
                    }
                }
                
                handleEditorInput();
                // Keep view scrolled to cursor
                editor.scrollTop = editor.scrollHeight;
            };
            
            recognition.onend = () => { if (isRecording) recognition.start(); };
        }

        function toggleSpeech() {
            const btn = document.getElementById('micBtn');
            if (isRecording) {
                recognition.stop();
                isRecording = false;
                btn.classList.remove('bg-red-600', 'text-white', 'shadow-lg');
                btn.querySelector('span').innerText = "Dictate";
            } else {
                if (!currentPaperId) return alert("Select a paper first!");
                recognition.start();
                isRecording = true;
                btn.classList.add('bg-red-600', 'text-white', 'shadow-lg');
                btn.querySelector('span').innerText = "On Air";
                showToast("Real-time Dictation Active");
            }
        }

        // --- UI & Data Persistence ---
        function switchTab(tab) {
            document.querySelectorAll('.ribbon-tab').forEach(t => t.classList.remove('active'));
            document.getElementById(`tab-${tab}`).classList.add('active');
            ['home', 'insert', 'ai'].forEach(c => document.getElementById(`content-${c}`)?.classList.add('hidden'));
            document.getElementById(`content-${tab}`)?.classList.remove('hidden');
        }

        async function api(url, method = 'GET', body = null) {
            const options = { method, headers: { 'Content-Type': 'application/json' } };
            if (body) options.body = JSON.stringify(body);
            const res = await fetch(url, options);
            if (res.status === 204) return null;
            return res.json();
        }

        async function loadUI() {
            const data = await api('/api/classes');
            sidebarData = data;
            renderSidebar(data);
        }

        function renderSidebar(data) {
            const list = document.getElementById('classList');
            list.innerHTML = data.map(cls => `
                <div class="mb-2">
                    <div class="flex items-center justify-between p-2 px-3 rounded hover:bg-gray-200 cursor-pointer group transition-all">
                        <span class="text-[11px] font-black text-gray-700 tracking-wider">${cls.name.toUpperCase()}</span>
                        <div class="flex gap-2 opacity-0 group-hover:opacity-100">
                            <button onclick="promptAddPaper(${cls.id})" class="text-blue-600"><i class="fas fa-plus-circle"></i></button>
                            <button onclick="deleteClass(${cls.id})" class="text-gray-400 hover:text-red-500"><i class="fas fa-trash text-[10px]"></i></button>
                        </div>
                    </div>
                    <div class="ml-2 border-l border-gray-200 space-y-1 mt-1">
                        ${cls.papers.map(p => `
                            <button onclick="openPaper('${cls.name}', '${p.name}', ${p.id}, this)" 
                                    class="nav-item text-[11px] text-gray-500 hover:text-blue-700 hover:bg-white block w-full text-left truncate py-2 pl-4 transition-all border-l-2 border-transparent">
                                <i class="far fa-file-alt mr-2 opacity-40"></i> ${p.name}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        async function openPaper(cname, pname, id, btn) {
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('nav-item-active'));
            btn.classList.add('nav-item-active');
            
            currentPaperId = id;
            document.getElementById('noteTitle').value = pname;
            document.getElementById('syncIndicator').innerText = "Loading...";
            
            const notes = await api(`/api/notes?paperId=${id}`);
            const editor = document.getElementById('noteContent');
            if (notes.length > 0) {
                const note = notes[0];
                currentNoteId = note.id;
                editor.innerHTML = note.content;
                document.getElementById('summaryDisplay').innerText = note.summary || "Summary pending.";
            } else {
                currentNoteId = null;
                editor.innerHTML = "<div><br></div>";
            }
            updateStats();
            setSyncStatus('synced');
        }

        async function saveNote() {
            if (!currentPaperId) return;
            try {
                const res = await api('/api/notes', 'POST', {
                    id: currentNoteId,
                    paperId: currentPaperId,
                    title: document.getElementById('noteTitle').value,
                    content: document.getElementById('noteContent').innerHTML,
                    summary: document.getElementById('summaryDisplay').innerText
                });
                currentNoteId = res.id;
                setSyncStatus('synced');
            } catch (e) { setSyncStatus('error'); }
        }

        // --- Ribbon Tools ---
        function insertTable() {
            let html = "<table contenteditable='true'><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table><p><br></p>";
            format('insertHTML', html);
        }

        function uploadImage(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => format('insertHTML', `<img src="${e.target.result}">`);
                reader.readAsDataURL(input.files[0]);
            }
        }

        // --- AI Operations ---
        async function runAI(system, prompt) {
            if(!apiKey) return "Error: Add Gemini API Key to script.";
            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: system }] } })
                });
                const data = await res.json();
                return data.candidates[0].content.parts[0].text;
            } catch(e) { return "AI Sync Failure."; }
        }

        async function summarizeWithAI() {
            const text = document.getElementById('noteContent').innerText;
            if (text.length < 50) return alert("Write more content first.");
            document.getElementById('summaryDisplay').innerText = "AI is generating summary...";
            switchTab('ai');
            const res = await runAI("Summarize professionally for academic notes. 3 sentences max.", text);
            document.getElementById('summaryDisplay').innerText = res;
            autoSaveDebounced();
        }

        // --- Helpers ---
        function updateStats() {
            const text = document.getElementById('noteContent').innerText;
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            document.getElementById('wordCount').innerText = `${words} words`;
            document.getElementById('wordCountStat').innerText = words;
            document.getElementById('charCount').innerText = text.length;
        }

        function showToast(msg) {
            const t = document.getElementById('commandToast');
            document.getElementById('toastMsg').innerText = msg;
            t.classList.remove('opacity-0', 'translate-y-10');
            t.classList.add('opacity-100', 'translate-y-0');
            setTimeout(() => {
                t.classList.add('opacity-0', 'translate-y-10');
                t.classList.remove('opacity-100', 'translate-y-0');
            }, 3000);
        }

        function promptAddClass() {
            const n = prompt("New Academic Project/Class Name:");
            if (n) api('/api/classes', 'POST', { name: n }).then(loadUI);
        }
        function promptAddPaper(cid) {
            const n = prompt("Module/Paper Name:");
            if (n) api('/api/papers', 'POST', { name: n, class_id: cid }).then(loadUI);
        }
        async function deleteClass(id) { if(confirm("Erase Project?")) api(`/api/classes/${id}`, 'DELETE').then(loadUI); }

        loadUI();
    </script>
</body>
</html>
"""

# --- API Endpoints ---
@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/classes', methods=['GET', 'POST'])
def handle_classes():
    if request.method == 'POST':
        db.session.add(AcademicClass(name=request.json['name']))
        db.session.commit()
        return jsonify({"status": "success"})
    classes = AcademicClass.query.order_by(AcademicClass.created_at.desc()).all()
    return jsonify([{"id": c.id, "name": c.name, "papers": [{"id": p.id, "name": p.name} for p in c.papers]} for c in classes])

@app.route('/api/classes/<int:id>', methods=['DELETE'])
def delete_class(id):
    AcademicClass.query.filter_by(id=id).delete()
    db.session.commit()
    return '', 204

@app.route('/api/papers', methods=['POST'])
def add_paper():
    db.session.add(Paper(name=request.json['name'], class_id=request.json['class_id']))
    db.session.commit()
    return jsonify({"status": "success"})

@app.route('/api/papers/<int:id>', methods=['DELETE'])
def delete_paper(id):
    Paper.query.filter_by(id=id).delete()
    db.session.commit()
    return '', 204

@app.route('/api/notes', methods=['GET', 'POST'])
def handle_notes():
    if request.method == 'POST':
        data = request.json
        note = Note.query.get(data.get('id')) if data.get('id') else Note(paper_id=data['paperId'])
        note.title = data.get('title', note.title)
        note.content = data.get('content', note.content)
        note.summary = data.get('summary', note.summary)
        if not note.id: db.session.add(note)
        db.session.commit()
        return jsonify({"id": note.id})
    
    paper_id = request.args.get('paperId')
    notes = Note.query.filter_by(paper_id=paper_id).all() if paper_id else Note.query.order_by(Note.updated_at.desc()).limit(10).all()
    return jsonify([{"id": n.id, "title": n.title, "content": n.content, "summary": n.summary, "paperId": n.paper_id} for n in notes])

if __name__ == '__main__':
    print("Nexus Ultimate LMS starting on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)