# Create a comprehensive Mermaid diagram of "The Auditory-Linguistic Perceptual Loom"
diagram_code = """
flowchart LR
    %% Raw Input
    A[Raw Auditory/<br/>Visual Flux<br/>~Signal & Noise~] 
    
    %% Linguistic Loom Components
    B[Phonemic<br/>Threaders<br/>🧵]
    C[Lexical<br/>Threaders<br/>🏷️]  
    D[Grammatical<br/>Weavers<br/>🕸️]
    E[Oral Resonance<br/>Chamber<br/>🔊]
    
    %% Output
    F[Perceptual<br/>Fabric<br/>🧠✨]
    
    %% Feedback
    G[Cognitive<br/>Feedback Spool<br/>⚙️]
    
    %% Main Processing Flows
    A -.->|weaving| B
    A -.->|weaving| C
    A -.->|weaving| D
    A -->|direct| E
    
    %% To Output
    B -->|encoding| F
    C -->|encoding| F  
    D -->|encoding| F
    E -->|cultural| F
    
    %% Feedback Loop
    F -->|experience| G
    G -.->|shaping| B
    G -.->|shaping| C
    G -.->|shaping| D
    
    %% Styling
    classDef input fill:#B3E5EC,stroke:#1FB8CD,stroke-width:3px
    classDef processor fill:#A5D6A7,stroke:#2E8B57,stroke-width:2px
    classDef output fill:#FFCDD2,stroke:#DB4545,stroke-width:3px
    classDef feedback fill:#FFEB8A,stroke:#D2BA4C,stroke-width:2px
    
    class A input
    class B,C,D,E processor
    class F output
    class G feedback
"""

# Create the mermaid diagram
png_path, svg_path = create_mermaid_diagram(
    diagram_code, 
    png_filepath='auditory_linguistic_loom.png',
    svg_filepath='auditory_linguistic_loom.svg',
    width=1400,
    height=900
)

print(f"Mermaid diagram saved as: {png_path} and {svg_path}")