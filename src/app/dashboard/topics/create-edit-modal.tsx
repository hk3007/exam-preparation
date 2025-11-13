"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';

import type { 
    TopicLean, 
    DescriptionNode, 
    TableNode, 
    ExampleNode 
} from "@/models/Topic"; 


// --- Icon Imports (using Lucide-React equivalent for illustrative purposes) ---
// Note: Assuming these icons are available in the project environment.
const Trash2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
const Table = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M2 10h20"/><path d="M10 4v16"/></svg>;
const ClipboardList = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>;
const TextIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/><path d="M21 20H3"/><path d="M15 15l-3 5-3-5"/></svg>;
const ChevronUp = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;
const ChevronDown = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;

interface ModalProps {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
  initialData: TopicLean | null;
}

// Helper to safely generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper to format JSON for submission
const formatJson = (data: DescriptionNode[] | undefined): string => {
    if (!data || data.length === 0) return '[]';
    try {
        const cleanedData = data.map(node => {
            const { id, ...rest } = node; // Remove temporary client-side ID
            return rest;
        });
        return JSON.stringify(cleanedData, null, 2);
    } catch (e) {
        return '';
    }
}

// ----------------------------------------------------------------------
// 1. Table Modal Component (Skipped for brevity, assume content is stable)
// ----------------------------------------------------------------------

interface TableModalProps {
    isOpen: boolean;
    onClose: (data?: TableNode) => void;
    initialData?: TableNode;
}

const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, initialData }) => {
    // ... (TableModal implementation, assume stable)
    const [headers, setHeaders] = useState(initialData?.headers.join(', ') || '');
    const [rows, setRows] = useState(initialData?.rows || [['', '', '']]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setHeaders(initialData?.headers.join(', ') || '');
            setRows(initialData?.rows || [['', '', '']]);
            setError('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const numColumns = headers.split(',').map(s => s.trim()).filter(s => s.length > 0).length;

    const handleSave = () => {
        const cleanedHeaders = headers.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (cleanedHeaders.length === 0) {
            setError("Please define table headers.");
            return;
        }

        const validRows = rows.filter(row => row.some(cell => cell.trim().length > 0));
        
        const data: TableNode = {
            headers: cleanedHeaders,
            rows: validRows.map(row => 
                row.slice(0, cleanedHeaders.length).concat(Array(cleanedHeaders.length - row.length).fill(''))
            ),
        };
        onClose(data);
    };

    const updateCell = (rowIndex: number, colIndex: number, value: string) => {
        const newRows = rows.map((row, rIdx) => {
            if (rIdx === rowIndex) {
                const newRow = [...row];
                newRow[colIndex] = value;
                return newRow;
            }
            return row;
        });
        setRows(newRows);
    };

    const addRow = () => {
        setRows(prev => [...prev, Array(numColumns || 3).fill('')]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[60]">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">Edit Table Content</h3>
                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</div>}

                <InputField 
                    label="Headers (Comma-separated list)" 
                    name="headers" 
                    value={headers} 
                    onChange={(e) => setHeaders(e.target.value)} 
                />

                <div className="mt-4 overflow-x-auto max-h-64">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                {headers.split(',').map(h => h.trim()).filter(h => h.length > 0).map((h, i) => (
                                    <th key={i} className="p-2 border text-left text-sm font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rIndex) => (
                                <tr key={rIndex}>
                                    {Array(numColumns).fill(0).map((_, cIndex) => (
                                        <td key={cIndex} className="p-1 border">
                                            <input
                                                type="text"
                                                value={row[cIndex] || ''}
                                                onChange={(e) => updateCell(rIndex, cIndex, e.target.value)}
                                                className="w-full p-1 text-sm border-none focus:outline-none"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button 
                        type="button" 
                        onClick={addRow} 
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
                    >
                        + Add Row
                    </button>
                    <div className="space-x-4">
                        <button 
                            type="button" 
                            onClick={() => onClose()} 
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSave} 
                            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
                        >
                            Save Table
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// 2. Example Modal Component (Skipped for brevity, assume content is stable)
// ----------------------------------------------------------------------
interface ExampleModalProps {
    isOpen: boolean;
    onClose: (data?: ExampleNode) => void;
    initialData?: ExampleNode;
}

const ExampleModal: React.FC<ExampleModalProps> = ({ isOpen, onClose, initialData }) => {
    // ... (ExampleModal implementation, assume stable)
    const [title, setTitle] = useState(initialData?.title || '');
    const [givenJson, setGivenJson] = useState(JSON.stringify(initialData?.given || {}, null, 2));
    const [stepsJson, setStepsJson] = useState(JSON.stringify(initialData?.steps || {}, null, 2));
    const [answerJson, setAnswerJson] = useState(JSON.stringify(initialData?.answer || {}, null, 2));
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title || '');
            setGivenJson(JSON.stringify(initialData?.given || {}, null, 2));
            setStepsJson(JSON.stringify(initialData?.steps || {}, null, 2));
            setAnswerJson(JSON.stringify(initialData?.answer || {}, null, 2));
            setError('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!title.trim()) {
            setError("Title is required for the example.");
            return;
        }

        try {
            const given = givenJson.trim() ? JSON.parse(givenJson) : undefined;
            const steps = stepsJson.trim() ? JSON.parse(stepsJson) : undefined;
            const answer = answerJson.trim() ? JSON.parse(answerJson) : undefined;

            const data: ExampleNode = { title, given, steps, answer };
            onClose(data);
        } catch (e) {
            setError("Invalid JSON format in one of the object fields (Given, Steps, or Answer).");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[60]">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">Edit Example Content</h3>
                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{error}</div>}

                <InputField 
                    label="Example Title" 
                    name="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />

                <JsonTextarea label="Given (JSON Object)" value={givenJson} onChange={(e) => setGivenJson(e.target.value)} />
                <JsonTextarea label="Steps (JSON Object)" value={stepsJson} onChange={(e) => setStepsJson(e.target.value)} />
                <JsonTextarea label="Answer (JSON Object)" value={answerJson} onChange={(e) => setAnswerJson(e.target.value)} />

                <div className="flex justify-end space-x-4 pt-4">
                    <button 
                        type="button" 
                        onClick={() => onClose()} 
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSave} 
                        className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
                    >
                        Save Example
                    </button>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// 3. Content Editor Component (FIXED LOGIC)
// ----------------------------------------------------------------------

interface ContentEditorProps {
    initialContent: DescriptionNode[];
    onContentChange: (content: DescriptionNode[]) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ initialContent, onContentChange }) => {
    
    const initializeContent = (content: DescriptionNode[]): DescriptionNode[] => {
        return content.map(node => ({ ...node, id: node.id || generateId() }));
    };

    // Initialization relies on the parent's `key` prop to reset state when initialData changes.
    const [content, setContent] = useState<DescriptionNode[]>(() => 
        initializeContent(initialContent) 
    );

    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState<number | null>(null);

    // **CRITICAL FIX**: The useEffect that caused the loop is permanently removed.
    // The only useEffect remaining is the one that sends updates back to the parent.
    
    // Sync content changes up to the parent form
    useEffect(() => {
        onContentChange(content);
    }, [content, onContentChange]); 

    // --- Core Array Operations (No Change) ---

    const updateNode = (index: number, updates: Partial<DescriptionNode>) => {
        setContent(prev => prev.map((node, i) => 
            i === index ? { ...node, ...updates } : node
        ));
    };

    const deleteNode = (index: number) => {
        setContent(prev => prev.filter((_, i) => i !== index));
    };

    const reorderNode = (index: number, direction: 'up' | 'down') => {
        const newContent = [...content];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newContent.length) {
            [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
            setContent(newContent);
        }
    };

    const addNode = (type: 'point' | 'expression' | 'table' | 'example') => {
        const newNode: DescriptionNode = { id: generateId() };
        let nodeIndex = content.length;
        
        if (type === 'point') newNode.point = '';
        if (type === 'expression') newNode.expression = '';
        if (type === 'table') {
            newNode.tables = [{ headers: [], rows: [] }]; 
            setModalIndex(nodeIndex);
            setIsTableModalOpen(true);
        }
        if (type === 'example') {
            newNode.examples = [{ title: 'New Example', given: {}, steps: {}, answer: {} }];
            setModalIndex(nodeIndex);
            setIsExampleModalOpen(true);
        }
        
        setContent(prev => [...prev, newNode]);
    };

    // --- Modal Handlers (No Change) ---

    const handleTableModalClose = (data?: TableNode) => {
        if (modalIndex === null) return;
        
        if (data && data.headers.length > 0) {
            updateNode(modalIndex, { tables: [data] });
        } else {
            deleteNode(modalIndex);
        }
        setIsTableModalOpen(false);
        setModalIndex(null);
    };

    const handleExampleModalClose = (data?: ExampleNode) => {
        if (modalIndex === null) return;

        if (data) {
            updateNode(modalIndex, { examples: [data] });
        } else {
             deleteNode(modalIndex);
        }
        setIsExampleModalOpen(false);
        setModalIndex(null);
    };

    const handleEditTable = (index: number, initialData: TableNode) => {
        setModalIndex(index);
        setIsTableModalOpen(true);
    };
    
    const handleEditExample = (index: number, initialData: ExampleNode) => {
        setModalIndex(index);
        setIsExampleModalOpen(true);
    };

    const getInitialTableData = useMemo(() => {
        if (modalIndex !== null && content[modalIndex]?.tables) {
            return content[modalIndex].tables![0];
        }
        return undefined;
    }, [modalIndex, content]);

    const getInitialExampleData = useMemo(() => {
        if (modalIndex !== null && content[modalIndex]?.examples) {
            return content[modalIndex].examples![0];
        }
        return undefined;
    }, [modalIndex, content]);


    // --- Node Renderer (Skipped for brevity, assume content is stable) ---
    const renderNode = (node: DescriptionNode, index: number) => {
        const isFirst = index === 0;
        const isLast = index === content.length - 1;

        let contentElement;
        let typeLabel = "Text";
        let editButton;

        if (node.point !== undefined) {
            contentElement = (
                <textarea
                    value={node.point}
                    onChange={(e) => updateNode(index, { point: e.target.value })}
                    className="w-full p-2 border rounded-md min-h-[50px] resize-y focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Enter main point or detail here..."
                />
            );
            typeLabel = "Point/Detail";
        } else if (node.expression !== undefined) {
            contentElement = (
                <input
                    type="text"
                    value={node.expression}
                    onChange={(e) => updateNode(index, { expression: e.target.value })}
                    className="w-full p-2 border rounded-md font-mono bg-gray-50 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Enter mathematical/scientific expression..."
                />
            );
            typeLabel = "Expression";
        } else if (node.tables && node.tables.length > 0) {
            const table = node.tables[0];
            contentElement = (
                <div className="p-3 border-l-4 border-sky-500 bg-sky-50 rounded-r-md text-sm">
                    <p className="font-bold">Table: {table.headers.length} Columns, {table.rows.length} Rows</p>
                    <p className="truncate text-xs text-gray-600">Headers: {table.headers.join(' | ')}</p>
                </div>
            );
            typeLabel = "Table";
            editButton = (
                <button 
                    type="button" 
                    onClick={() => handleEditTable(index, table)} 
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-2"
                >
                    Edit
                </button>
            );
        } else if (node.examples && node.examples.length > 0) {
            const example = node.examples[0];
            contentElement = (
                <div className="p-3 border-l-4 border-amber-500 bg-amber-50 rounded-r-md text-sm">
                    <p className="font-bold">Example: {example.title}</p>
                    <p className="truncate text-xs text-gray-600">Steps: {Object.keys(example.steps || {}).length}</p>
                </div>
            );
            typeLabel = "Example";
            editButton = (
                <button 
                    type="button" 
                    onClick={() => handleEditExample(index, example)} 
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-2"
                >
                    Edit
                </button>
            );
        } else {
            contentElement = <p className="text-gray-400">Empty or unknown node type.</p>;
            typeLabel = "Unknown";
        }

        return (
            <div key={node.id} className="border border-gray-200 rounded-lg p-3 mb-2 bg-white shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600">{typeLabel} #{index + 1}</span>
                    
                    <div className="flex space-x-1 items-center">
                        {editButton}
                        <button 
                            type="button" 
                            onClick={() => reorderNode(index, 'up')}
                            disabled={isFirst}
                            className={`p-1 rounded transition ${isFirst ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                            title="Move Up"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => reorderNode(index, 'down')}
                            disabled={isLast}
                            className={`p-1 rounded transition ${isLast ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                            title="Move Down"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => deleteNode(index)} 
                            className="p-1 rounded text-red-500 hover:bg-red-50 transition"
                            title="Delete Node"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {contentElement}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b pb-2">Topic Content Builder</h4>

            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                <span className="text-sm font-medium text-gray-600 mr-2">Add Content Block:</span>
                <button 
                    type="button" 
                    onClick={() => addNode('point')}
                    className="flex items-center space-x-1 px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-100 transition text-sm"
                >
                    <TextIcon className="w-4 h-4 text-sky-600" /> <span>Text/Point</span>
                </button>
                <button 
                    type="button" 
                    onClick={() => addNode('expression')}
                    className="flex items-center space-x-1 px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-100 transition text-sm"
                >
                    <TextIcon className="w-4 h-4 text-indigo-600" /> <span>Expression</span>
                </button>
                <button 
                    type="button" 
                    onClick={() => addNode('table')}
                    className="flex items-center space-x-1 px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-100 transition text-sm"
                    disabled={isTableModalOpen || isExampleModalOpen}
                >
                    <Table className="w-4 h-4 text-green-600" /> <span>Table</span>
                </button>
                <button 
                    type="button" 
                    onClick={() => addNode('example')}
                    className="flex items-center space-x-1 px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-100 transition text-sm"
                    disabled={isTableModalOpen || isExampleModalOpen}
                >
                    <ClipboardList className="w-4 h-4 text-amber-600" /> <span>Example</span>
                </button>
            </div>

            <div className="min-h-[150px] border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-100">
                {content.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Use the buttons above to start building the topic content.</p>
                ) : (
                    content.map(renderNode)
                )}
            </div>

            <TableModal 
                isOpen={isTableModalOpen} 
                onClose={handleTableModalClose} 
                initialData={getInitialTableData} 
            />
            <ExampleModal 
                isOpen={isExampleModalOpen} 
                onClose={handleExampleModalClose} 
                initialData={getInitialExampleData} 
            />
        </div>
    );
};


// ----------------------------------------------------------------------
// 4. Main Modal Component (FINAL FIXED LOGIC)
// ----------------------------------------------------------------------

export default function CreateEditTopicModal({ isOpen, onClose, initialData }: ModalProps) {
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        exam: initialData?.exam || '',
        slug: initialData?.slug || '',
        link: initialData?.link || '',
        views: initialData?.views.toString() || '0',
    });
    
    // Stabilize the initial content reference using useMemo
    const stableInitialContent = useMemo(() => {
        // This is necessary because initialData is a prop, and we only want the array reference to change when initialData changes.
        return initialData?.description || [];
    }, [initialData]); 

    // State to hold structured content array (Initialize using the stable value)
    const [structuredContent, setStructuredContent] = useState<DescriptionNode[]>(stableInitialContent);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Sync state when initialData changes
    useEffect(() => {
        setFormData({
            name: initialData?.name || '',
            exam: initialData?.exam || '',
            slug: initialData?.slug || '',
            link: initialData?.link || '',
            views: initialData?.views.toString() || '0',
        });
        
        // This resets the content state in the parent when the topic changes (or modal opens/closes)
        // We MUST use the stableInitialContent here to avoid recreating the array reference every render.
        setStructuredContent(stableInitialContent); 
        setMessage(null);
    }, [initialData, stableInitialContent]); // Dependencies ensure this runs only when topic data changes

    // Effect to handle modal visibility (e.g., body scroll lock)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Callback that is passed to the ContentEditor. Since it uses no external dependencies 
    // besides setStructuredContent (which is a stable React setter), it's stable.
    const handleContentChange = useCallback((content: DescriptionNode[]) => {
        setStructuredContent(content);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        
        const payload: Record<string, any> = {
            name: formData.name,
            exam: formData.exam,
            slug: formData.slug,
            link: formData.link,
            views: parseInt(formData.views, 10),
        };
        
        try {
            payload.description = JSON.parse(formatJson(structuredContent)); 
        } catch (e) {
            setMessage('Internal Error: Failed to serialize content to JSON.');
            setLoading(false);
            return;
        }

        const url = isEditMode ? `/api/topic/${initialData!.slug}` : '/api/topic';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'API Error: Server communication failed' }));
                const errorMsg = errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} topic.`;
                throw new Error(errorMsg);
            }

            setMessage(`Topic ${isEditMode ? 'updated' : 'created'} successfully!`);
            setTimeout(() => onClose(true), 1500); 

        } catch (err: any) {
            console.error(err);
            setMessage(`Error: ${err.message || 'An unknown error occurred.'}`);
        } finally {
            setLoading(false);
        }
    };

    // Use a unique key based on the topic ID or 'new' for creation mode
    const topicKey = initialData?._id || 'new';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-0">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all duration-300">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">
                    {isEditMode ? 'Edit Topic' : 'Create New Topic'}
                </h2>
                
                {message && (
                    <div className={`p-3 mb-4 rounded-lg text-sm border ${message.startsWith('Error') ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'}`}>
                        {message.replace('Error: ', '')}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        <InputField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                        <InputField label="Exam" name="exam" value={formData.exam} onChange={handleChange} required />
                        <InputField 
                            label="Slug (Unique URL)" 
                            name="slug" 
                            value={formData.slug} 
                            onChange={handleChange} 
                            required 
                            disabled={isEditMode}
                            className={isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
                        />
                        <InputField label="Link" name="link" value={formData.link} onChange={handleChange} />
                        <InputField label="Views" name="views" type="number" value={formData.views} onChange={handleChange} />
                    </div>

                    <ContentEditor 
                        // The key forces a full re-mount/reset when initialData changes, 
                        // forcing ContentEditor's useState initializer to re-run.
                        key={topicKey} 
                        initialContent={structuredContent}
                        onContentChange={handleContentChange}
                    />

                    <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
                        <button 
                            type="button" 
                            onClick={() => onClose(false)} 
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 disabled:bg-gray-400 transition shadow-md"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Topic' : 'Create Topic'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Simple Input Field Component
const InputField: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}> = ({ label, name, value, onChange, type = 'text', required = false, disabled = false, className = '' }) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition ${className}`}
        />
    </div>
);

// Simple JSON Textarea Component
const JsonTextarea: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ label, value, onChange }) => (
    <div className="flex flex-col mt-4">
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            rows={4}
            className="p-2 border rounded-lg font-mono text-xs bg-gray-50 resize-y focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter valid JSON object here."
        />
    </div>
);