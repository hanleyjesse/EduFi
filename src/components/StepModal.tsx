import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { CheckCircle2, Lightbulb } from "lucide-react";
import type { FinancialStep } from "../App";

interface StepModalProps {
  step: FinancialStep | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StepModal({ step, isOpen, onClose }: StepModalProps) {
  if (!step) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#799952] rounded-full size-12 flex items-center justify-center border-2 border-[#e0af41]">
              <span className="text-[#fff5d6]">{step.id}</span>
            </div>
            <DialogTitle className="text-[#578027]">{step.title}</DialogTitle>
          </div>
          <DialogDescription className="text-[#45280b]">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h3 className="flex items-center gap-2 mb-3 text-[#578027]">
              <CheckCircle2 className="size-5" />
              Key Points
            </h3>
            <ul className="space-y-2">
              {step.details.map((detail, index) => (
                <li key={index} className="flex gap-2 text-[#45280b]">
                  <span className="text-[#799952] shrink-0">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#fff5d6] p-4 rounded-lg border border-[#e0af41]">
            <h3 className="flex items-center gap-2 mb-3 text-[#578027]">
              <Lightbulb className="size-5" />
              Pro Tips
            </h3>
            <ul className="space-y-2">
              {step.tips.map((tip, index) => (
                <li key={index} className="flex gap-2 text-[#45280b]">
                  <span className="text-[#e0af41] shrink-0">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-[#578027] hover:bg-[#799952] text-[#fff5d6] px-6 py-2 rounded-lg transition-colors border-2 border-[#e0af41]"
          >
            Got it!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
