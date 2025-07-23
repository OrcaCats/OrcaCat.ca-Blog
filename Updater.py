import json
import tkinter as tk
from tkinter import filedialog, messagebox, simpledialog
from PIL import Image, ImageTk
import os

class JSONEditor:
    def _on_mousewheel(self, event):
        if event.num == 4 or event.delta > 0:
            self.canvas.yview_scroll(-1, "units")
        elif event.num == 5 or event.delta < 0:
            self.canvas.yview_scroll(1, "units")

    def __init__(self, root):
        self.root = root
        self.root.title("Project JSON Editor")
        self.projects = []
        self.current_index = -1
        self.image_previews = {}
        self.current_file = None

        self.canvas = tk.Canvas(root, bg="white")
        self.scroll_y = tk.Scrollbar(root, orient="vertical", command=self.canvas.yview)
        self.frame = tk.Frame(self.canvas)

        self.canvas.configure(yscrollcommand=self.scroll_y.set)
        self.scroll_y.pack(side="right", fill="y")
        self.canvas.pack(side="left", fill="both", expand=True)
        self.canvas_frame = self.canvas.create_window((0, 0), window=self.frame, anchor="nw")
        self.frame.bind("<Configure>", lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)
        self.canvas.bind_all("<Button-4>", self._on_mousewheel)  # Linux scroll up
        self.canvas.bind_all("<Button-5>", self._on_mousewheel)  # Linux scroll down

        self.load_button = tk.Button(self.frame, text="Load JSON", command=self.load_json)
        self.load_button.pack()

        self.add_button = tk.Button(self.frame, text="Add New Project", command=self.add_new_project)
        self.add_button.pack()

        self.project_listbox = tk.Listbox(self.frame)
        self.project_listbox.pack(fill=tk.BOTH, expand=True)
        self.project_listbox.bind("<<ListboxSelect>>", self.display_project)

        self.fields = {}
        for field in ["title", "date", "shortDescription"]:
            label = tk.Label(self.frame, text=field)
            label.pack()
            entry = tk.Entry(self.frame, width=100)
            entry.pack()
            self.fields[field] = entry

        label = tk.Label(self.frame, text="fullDescription")
        label.pack()
        text_box = tk.Text(self.frame, height=10, width=100)
        text_box.pack()
        self.fields["fullDescription"] = text_box

        label = tk.Label(self.frame, text="tags (comma-separated)")
        label.pack()
        self.tags_entry = tk.Entry(self.frame, width=100)
        self.tags_entry.pack()

        label = tk.Label(self.frame, text="technologies (comma-separated)")
        label.pack()
        self.tech_entry = tk.Entry(self.frame, width=100)
        self.tech_entry.pack()

        self.featured_var = tk.BooleanVar()
        self.featured_check = tk.Checkbutton(self.frame, text="Featured", variable=self.featured_var)
        self.featured_check.pack()

        self.image_fields = {}
        label = tk.Label(self.frame, text="main-image")
        label.pack()
        main_entry = tk.Entry(self.frame, width=100)
        main_entry.pack()
        main_button = tk.Button(self.frame, text=f"Select main-image", command=lambda: self.select_image("main-image"))
        main_button.pack()
        self.image_fields["main-image"] = main_entry
        preview = tk.Label(self.frame)
        preview.pack()
        self.image_previews["main-image"] = preview

        label = tk.Label(self.frame, text="images (comma-separated paths or URLs)")
        label.pack()
        self.images_entry = tk.Entry(self.frame, width=100)
        self.images_entry.pack()
        images_button = tk.Button(self.frame, text="Select images", command=self.select_images)
        images_button.pack()
        self.images_preview = tk.Frame(self.frame)
        self.images_preview.pack()

        self.save_button = tk.Button(self.frame, text="Save Changes", command=self.save_changes)
        self.save_button.pack()
        self.export_button = tk.Button(self.frame, text="Export JSON", command=self.export_json)
        self.file_save_button = tk.Button(self.frame, text="Save to File", command=self.save_to_file)
        self.file_save_button.pack()
        self.export_button.pack()

    def to_relative_path(self, full_path):
        try:
            return os.path.relpath(full_path, start=os.getcwd())
        except:
            return full_path

    def select_image(self, key):
        file_path = filedialog.askopenfilename(filetypes=[("Image files", "*.png;*.jpg;*.jpeg;*.gif")])
        if file_path:
            rel_path = self.to_relative_path(file_path)
            self.image_fields[key].delete(0, tk.END)
            self.image_fields[key].insert(0, rel_path)
            self.show_preview(key, rel_path)

    def select_images(self):
        file_paths = filedialog.askopenfilenames(filetypes=[("Image files", "*.png;*.jpg;*.jpeg;*.gif")])
        if file_paths:
            rel_paths = [self.to_relative_path(p) for p in file_paths]
            joined = ",     ".join(rel_paths)
            self.images_entry.delete(0, tk.END)
            self.images_entry.insert(0, joined)
            self.show_preview("images", rel_paths[0])

    def show_preview(self, key, path):
        if key == "images":
            for widget in self.images_preview.winfo_children():
                widget.destroy()
            for p in self.images_entry.get().split(","):
                p = p.strip()
                if os.path.isfile(p):
                    try:
                        img = Image.open(p)
                        img.thumbnail((200, 200))
                        photo = ImageTk.PhotoImage(img)
                        label = tk.Label(self.images_preview, image=photo)
                        label.image = photo
                        label.pack(side="left", padx=5)
                    except:
                        continue
            return

        if not os.path.isfile(path):
            self.image_previews[key].configure(image="")
            self.image_previews[key].image = None
            return
        try:
            img = Image.open(path)
            img.thumbnail((200, 200))
            photo = ImageTk.PhotoImage(img)
            self.image_previews[key].configure(image=photo)
            self.image_previews[key].image = photo
        except:
            self.image_previews[key].configure(image="")
            self.image_previews[key].image = None
            
    def load_json(self):
        file_path = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
        if file_path:
            self.current_file = file_path
            with open(file_path, 'r') as f:
                data = json.load(f)
                self.projects = data.get("projects", [])
                self.project_listbox.delete(0, tk.END)
                for proj in self.projects:
                    self.project_listbox.insert(tk.END, proj.get("title", "Untitled"))

    def display_project(self, event):
        if not self.project_listbox.curselection():
            return
        index = self.project_listbox.curselection()[0]
        self.current_index = index
        project = self.projects[index]
        for key in self.fields:
            if key == "fullDescription":
                self.fields[key].delete("1.0", tk.END)
                self.fields[key].insert("1.0", project.get(key, ""))
            else:
                self.fields[key].delete(0, tk.END)
                self.fields[key].insert(0, project.get(key, ""))

        self.tags_entry.delete(0, tk.END)
        self.tags_entry.insert(0, ", ".join(project.get("tags", [])))

        self.image_fields["main-image"].delete(0, tk.END)
        self.image_fields["main-image"].insert(0, project.get("main-image", ""))
        self.show_preview("main-image", project.get("main-image", ""))

        self.images_entry.delete(0, tk.END)
        self.images_entry.insert(0, ",     ".join(project.get("images", [])))
        if project.get("images"):
            self.show_preview("images", project.get("images")[0])

        self.tech_entry.delete(0, tk.END)
        self.tech_entry.insert(0, ", ".join(project.get("technologies", [])))
        self.featured_var.set(project.get("featured", False))

    def add_new_project(self):
        new_project = {
            "title": "New Project",
            "date": "",
            "shortDescription": "",
            "fullDescription": "",
            "tags": [],
            "technologies": [],
            "main-image": "",
            "images": [],
            "featured": False
        }
        self.projects.append(new_project)
        self.project_listbox.insert(tk.END, new_project["title"])
        self.project_listbox.selection_clear(0, tk.END)
        self.project_listbox.selection_set(tk.END)
        self.display_project(None)

    def save_changes(self):
        if self.current_index == -1:
            return
        for key, entry in self.fields.items():
            if key == "fullDescription":
                self.projects[self.current_index][key] = entry.get("1.0", tk.END).strip()
            else:
                self.projects[self.current_index][key] = entry.get()

        self.projects[self.current_index]["tags"] = [tag.strip() for tag in self.tags_entry.get().split(",") if tag.strip()]
        self.projects[self.current_index]["main-image"] = self.image_fields["main-image"].get()
        images_string = self.images_entry.get()
        images = [img.strip() for img in images_string.split(",") if img.strip()]
        self.projects[self.current_index]["images"] = images[:1]

        self.project_listbox.delete(self.current_index)
        self.project_listbox.insert(self.current_index, self.fields["title"].get())
        self.projects[self.current_index]["technologies"] = [t.strip() for t in self.tech_entry.get().split(",") if t.strip()]
        self.projects[self.current_index]["featured"] = self.featured_var.get()
        messagebox.showinfo("Saved", "Changes saved for the current project.")
        self.save_to_file()

    def save_to_file(self):
        if self.current_file:
            with open(self.current_file, 'w') as f:
                json.dump({"projects": self.projects}, f, indent=2)
        else:
            self.export_json()

    def export_json(self):
        file_path = filedialog.asksaveasfilename(defaultextension=".json",
                                                 filetypes=[("JSON files", "*.json")])
        if file_path:
            with open(file_path, 'w') as f:
                json.dump({"projects": self.projects}, f, indent=2)
            messagebox.showinfo("Exported", "File saved successfully.")

if __name__ == '__main__':
    root = tk.Tk()
    app = JSONEditor(root)
    root.mainloop()
