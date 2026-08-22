import VDGNodeDrawerView, {
    type DrawerNode,
} from "@/features/missions/components/workspace/VDGNodeDrawerView";

export default function VDGNodeDrawerContainer({
    node,
    onClose,
}: {
    node: DrawerNode;
    onClose: () => void;
}) {
    return <VDGNodeDrawerView node={node} onClose={onClose} />;
}
