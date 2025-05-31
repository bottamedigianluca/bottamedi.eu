import os

# --- Configurazione ---
OUTPUT_FILENAME = "project_structure_and_content.txt"
ROOT_DIR = "."  # Directory corrente

# Cartelle da ignorare completamente (non verranno esplorate né listate)
IGNORE_DIRS = {
    "node_modules",
    ".git",
    "dist",
    "build",
    "__pycache__",
    ".vscode",
    ".idea",
    "venv",
    # Aggiungi altre cartelle che vuoi ignorare completamente
}

# Estensioni di file da cui NON vogliamo leggere il contenuto
# (verranno listati nella struttura ma il loro contenuto sarà omesso)
# Utile per file binari, immagini, o file di log molto grandi
BINARY_LIKE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",".webp",  # Immagini
    ".mp3", ".wav", ".ogg", ".mp4", ".mov", ".avi",  # Media
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", # Documenti
    ".zip", ".tar", ".gz", ".rar", ".jar", ".war", # Archivi
    ".exe", ".dll", ".so", ".o", ".a", ".lib", # Eseguibili/Librerie
    ".pyc",
    ".lock", # es. package-lock.json (spesso molto lungo)
    # Aggiungi altre estensioni binarie o irrilevanti per il contenuto
}

# Nomi di file specifici il cui contenuto non deve essere mostrato
# (verranno listati nella struttura ma il loro contenuto sarà omesso)
# Utile per file di configurazione con dati sensibili
EXCLUDE_CONTENT_FOR_FILES = {
    ".webp",
    ".env",
    ".env.local",
    "package-lock.json", # Anche se è .json, è spesso enorme e generato
    "yarn.lock",
    # Aggiungi altri nomi di file specifici
}

# File da ignorare completamente (non verranno listati né il loro contenuto letto)
IGNORE_FILES_ENTIRELY = {
    ".DS_Store",
    OUTPUT_FILENAME, # Ignora il file di output stesso
    os.path.basename(__file__), # Ignora lo script stesso
}
# --------------------

def get_project_structure(root_dir, ignore_dirs, ignore_files_entirely):
    """Genera la struttura ad albero del progetto."""
    structure = []
    files_to_read_content = []

    for dirpath, dirnames, filenames in os.walk(root_dir, topdown=True):
        # Rimuovi le directory da ignorare dalla lista dirnames (modifica in-place)
        dirnames[:] = [d for d in dirnames if d not in ignore_dirs and not d.startswith('.')] # Ignora anche cartelle nascoste non specificate

        # Calcola il percorso relativo e il livello di indentazione
        relative_path = os.path.relpath(dirpath, root_dir)
        level = relative_path.count(os.sep)
        indent = "    " * level

        if relative_path != ".":
            structure.append(f"{indent}|-- {os.path.basename(dirpath)}/")
            indent += "    " # Aumenta l'indentazione per i file dentro questa cartella
        else: # Siamo nella root directory
            structure.append(f"{os.path.basename(os.path.abspath(root_dir))}/") # Nome della cartella root

        # Ordina i file per una visualizzazione consistente
        sorted_filenames = sorted(f for f in filenames if f not in ignore_files_entirely)

        for fname in sorted_filenames:
            # Ignora i file nascosti a meno che non siano esplicitamente permessi (es. .gitignore)
            if fname.startswith('.') and fname not in {'.gitignore', '.env.example'}: # Aggiungi qui altri dotfiles da includere
                continue

            structure.append(f"{indent}|-- {fname}")
            # Aggiungi il percorso completo del file alla lista per leggerne il contenuto dopo
            files_to_read_content.append(os.path.join(dirpath, fname))

    return "\n".join(structure), files_to_read_content

def get_file_contents(filepaths, binary_like_extensions, exclude_content_for_files):
    """Legge e formatta il contenuto dei file specificati."""
    contents_output = []
    for fpath in filepaths:
        relative_fpath = os.path.relpath(fpath, ROOT_DIR)
        filename = os.path.basename(fpath)
        _, extension = os.path.splitext(filename)

        contents_output.append(f"\n\n--- FILE: {relative_fpath} ---\n")

        if filename in exclude_content_for_files or extension.lower() in binary_like_extensions:
            contents_output.append(f"[Contenuto di '{filename}' omesso (configurazione o tipo di file)]")
            continue

        try:
            with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
                if not content.strip(): # Se il file è vuoto o contiene solo spazi bianchi
                    contents_output.append("[File vuoto o solo spazi bianchi]")
                else:
                    contents_output.append(content)
        except UnicodeDecodeError:
            contents_output.append(f"[Contenuto di '{filename}' non leggibile come testo (probabilmente binario)]")
        except IOError as e:
            contents_output.append(f"[Errore durante la lettura di '{filename}': {e}]")
        except Exception as e:
            contents_output.append(f"[Errore generico durante la lettura di '{filename}': {e}]")
    return "".join(contents_output)

def main():
    """Funzione principale per generare il file di output."""
    print(f"Generazione struttura e contenuti del progetto in '{ROOT_DIR}'...")

    project_tree_str, files_to_read = get_project_structure(ROOT_DIR, IGNORE_DIRS, IGNORE_FILES_ENTIRELY)
    all_contents_str = get_file_contents(files_to_read, BINARY_LIKE_EXTENSIONS, EXCLUDE_CONTENT_FOR_FILES)

    try:
        with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
            f.write("STRUTTURA DEL PROGETTO:\n")
            f.write("=======================\n")
            f.write(project_tree_str)
            f.write("\n\n\nCONTENUTO DEI FILE:\n")
            f.write("===================\n")
            f.write(all_contents_str)
        print(f"\nFile '{OUTPUT_FILENAME}' generato con successo!")
        print(f"Percorso completo: {os.path.abspath(OUTPUT_FILENAME)}")
    except IOError as e:
        print(f"Errore durante la scrittura del file '{OUTPUT_FILENAME}': {e}")
    except Exception as e:
        print(f"Errore generico durante la scrittura del file: {e}")


if __name__ == "__main__":
    main()