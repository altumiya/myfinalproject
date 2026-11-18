import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaSave } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

export default function AddFAQ({ setActiveTab }) {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [order, setOrder] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();

    const apiBaseUrl = import.meta.env.VITE_APIBASEURL || 'http://localhost:8000/api/admin/';
    const baseUrl = apiBaseUrl.replace(/\/$/, '');

    useEffect(() => {
        if (id) return; 
        const fetchFAQs = async () => {
            try {
                const res = await axios.get(`${baseUrl}/faq/view`);
                const faqs = Array.isArray(res.data) ? res.data : (res.data.data || []);

                if (faqs.length > 0) {
                    const highestOrder = Math.max(...faqs.map(f => Number(f.order) || 0));
                    setOrder(String(highestOrder + 1));
                } else {
                    setOrder('1');
                }
            } catch (err) {
                console.warn('Failed to fetch FAQs for ordering', err);
                setOrder('1'); 
            }
        };
        fetchFAQs();
    }, [baseUrl, id]);

    useEffect(() => {
        if (id) {
            axios.get(`${baseUrl}/faq/details/${id}`)
            .then((res) => res.data)
            .then((finalRes) => {
                const { question, answer, order } = finalRes.data || {};
                setQuestion(question || '');
                setAnswer(answer || '');
                setOrder(order || '');
            })
            .catch((err) => {
                toast.error('Failed to fetch FAQ details.');
                console.error(err);
            });
        } else {
            setQuestion('');
            setAnswer('');
            setOrder('');
        }
    }, [id, baseUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const trimmedQuestion = String(question).trim();
        const trimmedAnswer = String(answer).trim();
        const parsedOrder = Number(order);

        // Validations
        if (!trimmedQuestion) return toast.error('Please fill the question');
        if (!trimmedAnswer) return toast.error('Please fill the answer');
        if (order === '' || isNaN(parsedOrder)) {
            setError({ order: "Order must be a valid number." });
            return; 
        }

        const payload = { 
            question: trimmedQuestion, 
            answer: trimmedAnswer, 
            order: parsedOrder 
        };
            
        setLoading(true);

        if (id) {
            // Update Existing FAQ
            axios.put(`${baseUrl}/faq/update/${id}`, payload)
            .then((res) => res.data)
            .then((finalRes) => {
                if (finalRes.status || finalRes.success) {
                    toast.success('FAQ updated successfully!');
                    if (typeof setActiveTab === 'function') {
                        setTimeout(() => setActiveTab('viewFAQ'), 2000);
                    } else {
                        setTimeout(() => navigate('/faqs/view'), 2000);
                    }
                } else {
                    setError(finalRes.error || null);
                    toast.error(finalRes.error?.message || finalRes.message || 'Failed to update FAQ.');
                }
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || 'Cannot connect to the server.');
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            // Create New FAQ
            try {
                const url = `${baseUrl}/faq/create`; 
                const res = await axios.post(url, payload, { 
                    headers: { 'Content-Type': 'application/json' } 
                });

                if (res.data.status || res.data.success) {
                    setQuestion('');
                    setAnswer('');
                    setOrder(String(parsedOrder + 1)); 
                    toast.success(res.data.message || 'FAQ added successfully!');
                    
                    if (typeof setActiveTab === 'function') {
                        setTimeout(() => setActiveTab('viewFAQ'), 2000); 
                    } else {
                        setTimeout(() => navigate('/faqs/view'), 2000);
                    }
                } else {
                    setError(res.data.error || null);
                    toast.error(res.data.error?.message || res.data.message || 'Failed to add FAQ.');
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Cannot connect to the server.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-2xl rounded-lg bg-white p-6 shadow-sm">
            
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {id ? 'Edit FAQ' : 'Add FAQ'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    {id ? 'Update the details of the frequently asked question.' : 'Create a new frequently asked question.'}
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    {error?.question && <span className="text-red-500 text-sm block mb-1">{error.question}</span>}
                    <label className="block mb-2 text-sm font-medium text-gray-900">Question</label>
                    <input
                        type="text"
                        name="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g. What is your return policy?"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    />
                </div>

                <div>
                    {error?.answer && <span className="text-red-500 text-sm block mb-1">{error.answer}</span>}
                    <label className="block mb-2 text-sm font-medium text-gray-900">Answer</label>
                    <textarea
                        name="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter the answer to the FAQ..."
                        rows="6"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    />
                </div>

                <div>
                    {error?.order && <span className="text-red-500 text-sm block mb-1">{error.order}</span>}
                    <label className="block mb-2 text-sm font-medium text-gray-900">Order</label>
                    <input
                        type="number"
                        name="order"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        placeholder="e.g. 1"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    />
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-4 focus:ring-blue-300 
                            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {id ? <FaSave /> : <FaPlus />}
                        {id ? 'Update FAQ' : 'Save FAQ'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('viewFAQ')}
                        className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
