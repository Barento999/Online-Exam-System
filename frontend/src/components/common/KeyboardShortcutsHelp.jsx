import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard, Command } from "lucide-react";
import { cn } from "@/lib/utils";

const isMac =
  typeof navigator !== "undefined" &&
  navigator.platform.toUpperCase().indexOf("MAC") >= 0;

const shortcuts = [
  {
    category: "Navigation",
    items: [
      { keys: [isMac ? "⌘" : "Ctrl", "K"], description: "Open search" },
      { keys: ["Esc"], description: "Close dialogs/modals" },
      { keys: ["Tab"], description: "Navigate between elements" },
      { keys: ["Shift", "Tab"], description: "Navigate backwards" },
    ],
  },
  {
    category: "Actions",
    items: [
      { keys: [isMac ? "⌘" : "Ctrl", "Z"], description: "Undo last action" },
      {
        keys: [isMac ? "⌘" : "Ctrl", "Shift", "Z"],
        description: "Redo action",
      },
      { keys: [isMac ? "⌘" : "Ctrl", "S"], description: "Save (in forms)" },
      { keys: ["Enter"], description: "Submit form/Confirm" },
    ],
  },
  {
    category: "Tables",
    items: [
      { keys: ["↑", "↓"], description: "Navigate table rows" },
      { keys: ["Space"], description: "Select/deselect row" },
      { keys: [isMac ? "⌘" : "Ctrl", "A"], description: "Select all" },
    ],
  },
  {
    category: "Search Results",
    items: [
      { keys: ["↑", "↓"], description: "Navigate results" },
      { keys: ["Enter"], description: "Open selected result" },
      { keys: ["Esc"], description: "Close search" },
    ],
  },
  {
    category: "Help",
    items: [{ keys: ["?"], description: "Show keyboard shortcuts" }],
  },
];

const KeyBadge = ({ keyName }) => (
  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
    {keyName}
  </kbd>
);

export const KeyboardShortcutsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for ? key to open shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Don't trigger if user is typing in an input
        if (
          e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA" ||
          e.target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
        title="Keyboard shortcuts (?)">
        <Keyboard className="h-4 w-4" />
        <span className="hidden sm:inline">Shortcuts</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Command className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm">{item.description}</span>
                      <div className="flex items-center gap-1">
                        {item.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <KeyBadge keyName={key} />
                            {keyIndex < item.keys.length - 1 && (
                              <span className="text-muted-foreground mx-1">
                                +
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Tip:</strong> Press <KeyBadge keyName="?" /> anytime to
              view these shortcuts. Most shortcuts work globally throughout the
              application.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
