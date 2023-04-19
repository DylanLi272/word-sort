import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
	const [curWord, setCurWord] = useState(null); // current word to display and make decision
	const [log, setLog] = useState([]); // display log for last 5 words processed
	const [buffer, setBuffer] = useState([]); // input buffer to choose words from
	const [history, setHistory] = useState([]); // history of decisions
	const [knownWords, setKnownWords] = useState([]);
	const [unknownWords, setUnknownWords] = useState([]);

	// const [uploadStatus, setUploadStatus] = useState(null);

	const inputRef = React.useRef();

	const handleLogUpdate = () => {
		const temp = history.slice(-5).map((item) => {
			return (
				< div className={`log-item log-${item[1]}`} key={`${item[0]}-${item[1]}`} >
					<div className='log-word'>
						{item[0]}
					</div>
				</div >)
		});
		setLog(temp);
	}

	const handleUndo = () => {
		const temp = history.pop();
		handleLogUpdate();
		buffer.unshift(curWord);
		setCurWord(temp[0])
	}

	const handleWordButton = (level) => {
		if (curWord == undefined || curWord == null) {
			return
		}
		history.push([curWord, level]);
		setCurWord(buffer.shift());
		handleLogUpdate();
	}

	const handleFileLoad = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const contents = e.target.result;
			const temp = contents.split(/\s+/);
			for (let i = temp.length - 1; i >= 0; i--) {
				if (knownWords.includes(temp[i])) {
					temp.splice(i, 1);
				}
			}
			setCurWord(temp.shift());
			setBuffer(temp);
		};

		reader.readAsText(file);
		setHistory([]);
		handleLogUpdate();
		// inputRef.current.value = '';
		// setUploadStatus('Upload success');
	};

	const handleDownload = (level) => {
		var text = '';
		var filename = level == 'yes' ? 'known-words.txt' : 'unknown-words.txt';
		history.forEach((item) => {
			if (item[1] == level) {
				text += `${item[0]}\n`;
			}
		});
		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	const handleKnownLoad = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const contents = e.target.result;
			const temp = contents.split(/\s+/);
			setKnownWords(temp);
		};

		reader.readAsText(file);
	}

	const handleFilterLoad = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const contents = e.target.result;
			const temp = contents.split(/\s+/);
			for (let i = temp.length - 1; i >= 0; i--) {
				if (knownWords.includes(temp[i])) {
					temp.splice(i, 1);
				}
			}
			setUnknownWords(temp);
		};

		reader.readAsText(file);
	}
	const handleDownloadUnknown = () => {
		var text = '';
		unknownWords.forEach(item => text += `${item}\n`);
		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', 'unknown-word.txt');

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	useEffect(() => {

	}, []);

	return (
		<div className='app'>
			<div className='filter-section'>
				<div>
					<div>Load Known Words</div>
					<input type="file" onChange={handleKnownLoad} accept=".txt" />
				</div>
				<div>
					<div>Input Words</div>
					<input type="file" onChange={handleFilterLoad} accept=".txt" />
				</div>
				<div className='button filter' onClick={handleDownloadUnknown}>Get filter words</div>
			</div>
			<div className='word-choosing'>
				<div className='log'>
					<div>Log history</div>
					<div className='history-log'>{log}</div>
					<div className='button download' onClick={() => { handleDownload('yes') }}>Download Known Words</div>
					<div className='button download' onClick={() => { handleDownload('nope') }}>Download Unknown Words</div>
				</div>
				<div className='word-area'>
					<div className='word-selection'>
						<div className='word-box'>
							<div className='word'>{curWord == undefined || curWord == null ? '*no words loaded*' : curWord}</div>
						</div>
						<div className='controls'>
							<div className='button yes' onClick={() => { handleWordButton('yes') }}>YES!</div>
							{/* <div className='button ehhh' onClick={() => { handleWordButton('ehhh') }}>Ehhh</div> */}
							<div className='button nope' onClick={() => { handleWordButton('nope') }}>Nope</div>
							<div className='button undo' onClick={handleUndo}>Undo</div>
						</div>
					</div>
					<input type="file" ref={inputRef} onChange={handleFileLoad} accept=".txt" />
					{/* <div className='upload-status'>{uploadStatus}</div> */}
				</div>
			</div>
		</div>
	);
}

export default App;
