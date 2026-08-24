import { type DrawerNode } from "@/features/missions/components/workspace/VDGNodeDrawerContext";
import VDGNodeDrawerView from "@/features/missions/components/workspace/VDGNodeDrawerView";

export default function VDGNodeDrawerContainer({
    node,
    onClose,
}: {
    node: DrawerNode;
    onClose: () => void;
}) {
    return <VDGNodeDrawerView node={node} onClose={onClose} />;
}
