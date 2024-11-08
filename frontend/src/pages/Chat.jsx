import React, { useState } from "react";

import { ArrowUpIcon } from "@heroicons/react/24/outline";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useSpring, animated, config } from "react-spring";
import TypingAnimation from "../components/TypingMessageAnimation";
import SimpleDialog from "../components/SimpleDialog";
import { errorToast } from "../notification";
import NotFoundPage from "./NotFoundPage";

const Chat = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [notFoundError, setNotFoundError] = useState(false);

    const slideIn = useSpring({
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 24,
        config: config.slow,
    });

    // Trigger the animation when the component mounts
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 200);
        return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }, []);

    const [newChatQuestion, setNewChatQuestion] = useState({
        studentQuestion: "",
    });

    const [followupQuestion, setFollowupQuestion] = useState("");

    const [conversationStarted, setConversationStarted] = useState(false);
    const [llmProcessing, setLlmProcessing] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);

    const handleNewChatInputChange = (e) => {
        const { name, value } = e.target;
        setNewChatQuestion({ ...newChatQuestion, [name]: value });
    };

    const handleFollowupQuestionChange = (e) => {
        setFollowupQuestion(e.target.value);
    };

    const appendToChatHistory = (newMessage) => {
        setChatHistory((prevState) => [...prevState, newMessage]);
    };

    const getLlmResponse = async (question, apiEndpoint) => {
        setLlmProcessing(true);
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(question),
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            appendToChatHistory(data);
            setLlmProcessing(false);
        } else if (response.status === 404) {
            errorToast("Result not found.");
            setNotFoundError(true);
        } else {
            errorToast("An error occured.");
        }
    };

    const getFollowupChatResponse = (followupQuestion) => {
        appendToChatHistory({ role: "user", content: followupQuestion });

        const apiInput = {
            studentQuestion: followupQuestion,
            chatHistory: chatHistory,
        };
        const apiEndpoint = "http://localhost:8000/follow-up/";
        return getLlmResponse(apiInput, apiEndpoint);
    };

    const handleFollowupChatSubmit = (e) => {
        e.preventDefault();
        getFollowupChatResponse(followupQuestion);
        setFollowupQuestion("");
        console.log(chatHistory);
    };

    const getNewChatResponse = () => {
        const apiInput = newChatQuestion;
        const apiEndpoint = "http://localhost:8000/new-chat/";
        return getLlmResponse(apiInput, apiEndpoint);
    };

    const handleNewChatSubmit = (e) => {
        e.preventDefault();
        // get LLM response from backend
        getNewChatResponse();
        setConversationStarted(true);
    };

    const handleNewChatKeyDown = (e) => {
        if (e.key === "Enter") {
            handleNewChatSubmit(e);
        }
    };

    const displayChatHistoryRecord = (chatHistoryRecord, index) => {
        if (chatHistoryRecord.role === "assistant") {
            return (
                <div
                    id={index}
                    key={index}
                    className="flex flex-col space-y-1 mb-6 mx-1"
                >
                    <p className="text-lg font-bold text-lime-900 dark:text-white">
                        STEM Tutor
                    </p>
                    <div className="relative bg-lime-200 p-4 rounded-3xl w-4/5 min-h-12 mr-auto dark:bg-lime-600 text-lg">
                        <Markdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            children={chatHistoryRecord.content}
                            className="prose max-w-none font-medium dark:text-white"
                        />
                        <SimpleDialog contexts={chatHistoryRecord.context} />
                    </div>
                </div>
            );
        } else if (chatHistoryRecord.role === "user") {
            return (
                <div
                    id={index}
                    key={index}
                    className="flex flex-col space-y-1 mb-6 mx-1"
                >
                    <div className="bg-lime-700 p-4 rounded-3xl max-w-4/5 min-h-12 ml-auto text-lg">
                        <Markdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            children={chatHistoryRecord.content}
                            className="prose max-w-none font-medium text-lime-50 prose-code:text-lime-50"
                        />
                    </div>
                </div>
            );
        }
    };

    const displayChatHistoryRecords = (chatHistoryRecords) => {
        if (llmProcessing) {
            return (
                <div>
                    {chatHistoryRecords.map((el, i) =>
                        displayChatHistoryRecord(el, i)
                    )}
                    <div className="flex flex-1 flex-col mb-2">
                        <p className="text-lg font-bold text-lime-900 dark:text-white">
                            STEM Tutor
                        </p>
                        <TypingAnimation />
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {chatHistoryRecords.map((el, i) =>
                        displayChatHistoryRecord(el, i)
                    )}
                </div>
            );
        }
    };

    const displayChatHistory = (chatHistoryRecords) => {
        return (
            <div className="flex flex-1 px-36 flex-col space-y-2 bg-lime-50 dark:bg-lime-800">
                {displayChatContext()}
                {displayChatHistoryRecords(chatHistoryRecords)}
            </div>
        );
    };

    const displayChatInterface = () => {
        if (!conversationStarted) {
            return (
                <div className="flex flex-1 items-center justify-center dark:bg-lime-800">
                    <h1 className="text-3xl tracking-tight font-bold text-lime-900 dark:text-white">
                        How can I help you today?
                    </h1>
                </div>
            );
        }
        if (conversationStarted) {
            return displayChatHistory(chatHistory);
        }
    };

    const displayNewChatInput = () => {
        return (
            <animated.div style={slideIn}>
                {displayNewChatQuestions(false)}
            </animated.div>
        );
    };

    const displayChatContext = () => {
        return (
            <div className="sticky top-15 bg-lime-50 z-10 py-4 dark:bg-lime-800">
                <div className="flex flex-col space-y-2 py-2">
                    {displayNewChatQuestions(true)}
                </div>
            </div>
        );
    };

    const displayNewChatQuestions = (disabled = false) => {
        const questionPlaceholder = disabled
            ? "No question provided"
            : "Enter your question";

        return (
            <form
                onSubmit={handleNewChatSubmit}
                onKeyDown={handleNewChatKeyDown}
                className="flex flex-col space-y-2"
            >
                <label className="flex flex-row items-center w-full max-h-48 flex-grow">
                    <div className="w-56 font-bold dark:text-white text-lg">
                        Question
                    </div>
                    <textarea
                        className="ml-4 input-base resize-none"
                        placeholder={questionPlaceholder}
                        type="text"
                        rows={2}
                        name="studentQuestion"
                        value={newChatQuestion.studentQuestion}
                        disabled={disabled}
                        onChange={handleNewChatInputChange}
                    />
                </label>

                {disabled ? null : (
                    <div className="flex flex-row justify-end">
                        <button
                            type="submit"
                            className="text-button"
                            disabled={newChatQuestion.studentQuestion === ""}
                        >
                            <ArrowUpIcon
                                className="mr-1 text-button-icon"
                                aria-hidden="true"
                            />
                            Submit
                        </button>
                    </div>
                )}
            </form>
        );
    };

    const displayFollowUpChatInput = () => {
        return (
            <form
                onSubmit={handleFollowupChatSubmit}
                className="flex flex-row space-x-4 bg-lime-50 pt-1 dark:bg-lime-800 mb-8"
            >
                <input
                    className="input-base"
                    placeholder="Message the STEM tutor"
                    type="text"
                    autoComplete="off"
                    name="followupQuestion"
                    value={followupQuestion}
                    onChange={handleFollowupQuestionChange}
                />
                <button type="submit" className="text-button">
                    <ArrowUpIcon
                        className="mr-1 text-button-icon "
                        aria-hidden="true"
                    />
                    Submit
                </button>
            </form>
        );
    };

    if (notFoundError) {
        return <NotFoundPage />;
    }

    return (
        <div className="flex flex-1 flex-col">
            {displayChatInterface()}
            <div className="sticky bottom-0 flex justify-center pt-0 pb-6 px-36 flex-col w-full bg-lime-50 dark:bg-lime-800">
                {conversationStarted
                    ? displayFollowUpChatInput()
                    : displayNewChatInput()}
            </div>
        </div>
    );
};

export default Chat;
