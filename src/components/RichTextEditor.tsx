import { useRef, useEffect } from "react";
import {
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Table as TableIcon, Code, Undo, Redo, Globe, Type,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onTranslate?: () => void;
  placeholder?: string;
  minHeight?: number;
}

const fontFamilies = ["Helvetica Neue", "Arial", "Georgia", "Verdana", "Times New Roman", "Courier New"];
const fontSizes = ["10", "12", "14", "16", "18", "20", "24", "28", "32"];

const ToolBtn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    title={title}
    className="h-8 w-8 flex items-center justify-center rounded hover:bg-accent text-foreground/80"
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, onTranslate, placeholder, minHeight = 160 }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt("Enter URL");
    if (url) exec("createLink", url);
  };

  const insertTable = () => {
    const html = `<table style="border-collapse:collapse;width:100%"><tbody>${
      Array.from({ length: 2 }).map(() =>
        `<tr>${Array.from({ length: 2 }).map(() => `<td style="border:1px solid #ccc;padding:6px">&nbsp;</td>`).join("")}</tr>`
      ).join("")
    }</tbody></table><p></p>`;
    exec("insertHTML", html);
  };

  const toggleHtmlView = () => {
    if (!editorRef.current) return;
    const html = prompt("Edit HTML", editorRef.current.innerHTML) ?? editorRef.current.innerHTML;
    editorRef.current.innerHTML = html;
    onChange(html);
  };

  return (
    <div className="border border-input rounded-lg bg-background overflow-hidden relative">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-input bg-muted/40">
        <select
          onChange={(e) => exec("fontName", e.target.value)}
          className="h-8 text-xs px-2 rounded hover:bg-accent bg-transparent border-0 focus:outline-none"
          defaultValue=""
        >
          <option value="" disabled>Font</option>
          {fontFamilies.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select
          onChange={(e) => exec("fontSize", e.target.value)}
          className="h-8 text-xs px-2 rounded hover:bg-accent bg-transparent border-0 focus:outline-none"
          defaultValue=""
        >
          <option value="" disabled>Size</option>
          {fontSizes.map((s, i) => <option key={s} value={String(Math.min(7, i + 1))}>{s}</option>)}
        </select>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolBtn onClick={() => exec("bold")} title="Bold"><Bold size={14} /></ToolBtn>
        <ToolBtn onClick={() => exec("italic")} title="Italic"><Italic size={14} /></ToolBtn>
        <ToolBtn onClick={() => exec("underline")} title="Underline"><Underline size={14} /></ToolBtn>
        <label className="h-8 w-8 flex items-center justify-center rounded hover:bg-accent cursor-pointer relative" title="Text Color">
          <Type size={14} />
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => exec("foreColor", e.target.value)}
          />
        </label>
        <label className="h-8 w-8 flex items-center justify-center rounded hover:bg-accent cursor-pointer relative" title="Background Color">
          <span className="w-3 h-3 rounded-sm border border-foreground/40 bg-yellow-200" />
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => exec("hiliteColor", e.target.value)}
          />
        </label>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolBtn onClick={() => exec("insertUnorderedList")} title="Bulleted list"><List size={14} /></ToolBtn>
        <ToolBtn onClick={() => exec("insertOrderedList")} title="Numbered list"><ListOrdered size={14} /></ToolBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolBtn onClick={() => exec("justifyLeft")} title="Align left"><AlignLeft size={14} /></ToolBtn>
        <ToolBtn onClick={() => exec("justifyCenter")} title="Align center"><AlignCenter size={14} /></ToolBtn>
        <ToolBtn onClick={() => exec("justifyRight")} title="Align right"><AlignRight size={14} /></ToolBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolBtn onClick={insertTable} title="Table"><TableIcon size={14} /></ToolBtn>
        <ToolBtn onClick={insertLink} title="Link"><LinkIcon size={14} /></ToolBtn>
        <ToolBtn onClick={toggleHtmlView} title="HTML view"><Code size={14} /></ToolBtn>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolBtn onClick={() => exec("undo")} title="Undo"><Undo size={14} /></ToolBtn>
        <ToolBtn onClick={() => exec("redo")} title="Redo"><Redo size={14} /></ToolBtn>

        {onTranslate && (
          <button
            type="button"
            onClick={onTranslate}
            title="Translate"
            className="ml-auto h-8 w-8 flex items-center justify-center rounded-full text-pink-500 hover:bg-pink-50"
          >
            <Globe size={16} />
          </button>
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="px-3 py-2 text-sm focus:outline-none prose prose-sm max-w-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
