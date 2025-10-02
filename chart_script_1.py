# Create a Mermaid flowchart showing the Sapir-Whorf morphisms/transformations
diagram_code = """
flowchart TD
    A[Raw Acoustic<br/>Input] --> A1[Cognitive<br/>Phoneme]
    A1 -.->|Tension: Objective<br/>vs Subjective| A2[Assert Absent<br/>Sounds]
    
    B[Pure Sound<br/>Vowels] --> B1[Semantic<br/>Association]
    B1 -.->|Front = Small<br/>Back = Large| B2[Size Perception<br/>Bias]
    
    C[Lexical<br/>Distinction] --> C1[Perceptual<br/>Separation]
    C1 -.->|English: 29/30<br/>Tarahumara: 13/24| C2[Blue/Green<br/>Distortion]
    
    D[Specific Verb<br/>Choice] --> D1[Altered Event<br/>Memory]
    D1 -.->|Smashed vs<br/>Contacted| D2[False Glass<br/>Memory]
    
    E[Act of<br/>Verbalization] --> E1[Impaired Visual<br/>Memory]
    E1 -.->|Description<br/>Interference| E2[Reduced Face<br/>Recognition]
    
    subgraph Reality [Objective Reality]
        A
        B
        C
        D
        E
    end
    
    subgraph Construct [Linguistic Construction]
        A2
        B2
        C2
        D2
        E2
    end
    
    subgraph Data [Experimental Evidence]
        F[Kay-Kempton:<br/>Color Boundaries]
        G[Phonetic Symbolism:<br/>i,e vs u,o,ɑ]
    end
    
    style Reality fill:#B3E5EC
    style Construct fill:#FFCDD2
    style Data fill:#A5D6A7
"""

# Create the mermaid diagram
png_path, svg_path = create_mermaid_diagram(
    diagram_code, 
    'sapir_whorf_morphisms.png', 
    'sapir_whorf_morphisms.svg',
    width=1400,
    height=1000
)

print(f"Chart saved as: {png_path} and {svg_path}")