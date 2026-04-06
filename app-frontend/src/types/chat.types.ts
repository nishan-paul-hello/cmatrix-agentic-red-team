/**
 * Chat-related type definitions
 */

export type MessageRole = "user" | "assistant";

export interface AnimationStep {
  step: number;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  duration: number;
}

export interface NetworkDiagram {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface NetworkNode {
  id: string;
  label: string;
  group?: string;
  color?: string;
  shape?: string;
  [key: string]: unknown;
}

export interface NetworkEdge {
  from: string;
  to: string;
  label?: string;
  color?: string;
  [key: string]: unknown;
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  animationSteps?: AnimationStep[];
  diagram?: NetworkDiagram;
  timestamp?: Date;
  id?: string;
  pending_approval?: import("./approval.types").PendingApproval;
  thread_id?: string;
}

export interface StreamChunk {
  token?: string;
  animation_step?: AnimationStep;
  diagram?: NetworkDiagram;
  error?: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  animationSteps?: AnimationStep[];
  diagram?: NetworkDiagram;
}
