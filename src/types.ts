export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  id: string;
  type: 'dataset' | 'table' | 'list' | 'filter';
  position: Position;
  data: {
    type?: string;
    name?: string;
    columns?: string[];
    condition?: string;
  };
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
}

export interface PropertyPaneProps {
  node: NodeData;
  onClose: () => void;
  onUpdate: (nodeId: string, data: NodeData['data']) => void;
}