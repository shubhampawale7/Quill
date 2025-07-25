import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion, useTransform } from "framer-motion";
import {
  FiBold,
  FiItalic,
  FiCode,
  FiList,
  FiArrowLeft,
  FiArrowRight,
  FiMinus,
  FiChevronsRight,
} from "react-icons/fi";
import { FaQuoteLeft, FaStrikethrough } from "react-icons/fa"; // Correct icon imports

// --- Reusable Menu Button Component ---
const MenuButton = ({ editor, action, params = [], icon, title }) => {
  const isActive =
    params.length > 0
      ? editor.isActive(action, ...params)
      : editor.isActive(action);

  const canExecute =
    params.length > 0
      ? editor
          .can()
          .chain()
          .focus()
          [action](...params)
          .run()
      : editor.can().chain().focus()[action]().run();

  return (
    <motion.button
      type="button"
      onClick={() =>
        editor
          .chain()
          .focus()
          [action](...params)
          .run()
      }
      disabled={!canExecute}
      className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-30 ${
        isActive
          ? "bg-sky-500 text-white"
          : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={title}
    >
      {icon}
    </motion.button>
  );
};

// --- The Toolbar Component ---
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50">
      <MenuButton
        editor={editor}
        action="undo"
        icon={<FiArrowLeft />}
        title="Undo"
      />
      <MenuButton
        editor={editor}
        action="redo"
        icon={<FiArrowRight />}
        title="Redo"
      />
      <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />
      <MenuButton
        editor={editor}
        action="toggleBold"
        icon={<FiBold />}
        title="Bold"
      />
      <MenuButton
        editor={editor}
        action="toggleItalic"
        icon={<FiItalic />}
        title="Italic"
      />
      <MenuButton
        editor={editor}
        action="toggleStrike"
        icon={<FaStrikethrough />}
        title="Strikethrough"
      />
      <MenuButton
        editor={editor}
        action="toggleCode"
        icon={<FiCode />}
        title="Code"
      />
      <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />
      <MenuButton
        editor={editor}
        action="toggleHeading"
        params={[{ level: 1 }]}
        icon={<span className="font-black">H1</span>}
        title="Heading 1"
      />
      <MenuButton
        editor={editor}
        action="toggleHeading"
        params={[{ level: 2 }]}
        icon={<span className="font-bold">H2</span>}
        title="Heading 2"
      />
      <MenuButton
        editor={editor}
        action="toggleHeading"
        params={[{ level: 3 }]}
        icon={<span className="font-semibold">H3</span>}
        title="Heading 3"
      />
      <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />
      <MenuButton
        editor={editor}
        action="toggleBulletList"
        icon={<FiList />}
        title="Bullet List"
      />
      <MenuButton
        editor={editor}
        action="toggleOrderedList"
        icon={<FiChevronsRight />}
        title="Ordered List"
      />
      <MenuButton
        editor={editor}
        action="toggleBlockquote"
        icon={<FaQuoteLeft />}
        title="Blockquote"
      />
      <MenuButton
        editor={editor}
        action="setHorizontalRule"
        icon={<FiMinus />}
        title="Horizontal Rule"
      />
    </div>
  );
};

// --- The Main Editor Component ---
const RichTextEditor = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none p-4 min-h-[250px] w-full max-w-full",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  const variants = {
    unfocused: {
      borderColor: "rgba(209, 213, 219, 1)", // gray-300
      boxShadow: "0 0 0px 0px rgba(56, 189, 248, 0)",
    },
    focused: {
      borderColor: "rgba(56, 189, 248, 1)", // sky-500
      boxShadow: "0 0 0px 3px rgba(56, 189, 248, 0.3)",
    },
  };

  return (
    <motion.div
      className="overflow-hidden rounded-xl border bg-white dark:bg-gray-900"
      variants={variants}
      animate={isFocused ? "focused" : "unfocused"}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <MenuBar editor={editor} />
      <div className="editor-content-container">
        <EditorContent editor={editor} />
      </div>
    </motion.div>
  );
};

export default RichTextEditor;
