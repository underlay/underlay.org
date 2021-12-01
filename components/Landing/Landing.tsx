// @ts-nocheck
import React, { useState } from "react";
import styles from "./Landing.module.scss";
import SHA3 from "crypto-js/sha3";
import encHex from "crypto-js/enc-hex";
import { ScopeNav } from "components";
import { useS3Upload } from "next-s3-upload";
import Editor from "components/Editor/Editor";

type Props = {};

const Landing: React.FC<Props> = function () {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [communityName, setCommunityName] = useState("");
	const [collectionName, setCollectionName] = useState("");
	// const [userdata, setUserdata] = useState({});

	const [imageUrl, setImageUrl] = useState();
	const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

	const handleFileChange = async (file) => {
		let { url } = await uploadToS3(file);
		setImageUrl(url);
	};

	// @ts-ignore
	const handleLogin = async (evt) => {
		evt.preventDefault();
		await fetch("/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: username, password: SHA3(password).toString(encHex) }),
		});
		window.location.href = "/";
	};
	const handleCommunityCreate = async (evt) => {
		evt.preventDefault();
		await fetch("/api/community", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: communityName }),
		});
		// window.location.href = "/";
	};
	const handleCollectionCreate = async (evt) => {
		evt.preventDefault();
		await fetch("/api/collection", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ slug: collectionName }),
		});
		// window.location.href = "/";
	};

	return (
		<div className={styles.landing}>
			<h1>Landing 2</h1>

			<ScopeNav
				navItems={[
					{
						slug: "overview",
						title: "Overview",
					},
					{ slug: "edit", title: "Edit" },
					{
						slug: "versions",
						title: "Versions",
					},
					{
						slug: "discussions",
						title: "Discussions",
					},
					{
						slug: "connections",
						title: "Connections",
					},
					{
						slug: "settings",
						title: "Settings",
					},
				]}
			/>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<label>
					Username:
					<input
						type="text"
						name="username"
						value={username}
						onChange={(evt) => {
							setUsername(evt.target.value);
						}}
					/>
				</label>
				<label>
					Password:
					<input
						type="text"
						name="password"
						value={password}
						onChange={(evt) => {
							setPassword(evt.target.value);
						}}
					/>
				</label>
				<input type="submit" value="Submit" />
			</form>

			<h2>Create Community</h2>
			<form onSubmit={handleCommunityCreate}>
				<label>
					Name:
					<input
						type="text"
						name="communityName"
						value={communityName}
						onChange={(evt) => {
							setCommunityName(evt.target.value);
						}}
					/>
				</label>
				<input type="submit" value="Submit" />
			</form>

			<h2>Create Collection</h2>
			<form onSubmit={handleCollectionCreate}>
				<label>
					Name:
					<input
						type="text"
						name="collectionName"
						value={collectionName}
						onChange={(evt) => {
							setCollectionName(evt.target.value);
						}}
					/>
				</label>
				<input type="submit" value="Submit" />
			</form>

			<h2>Upload</h2>
			<FileInput onChange={handleFileChange} />
			<button onClick={openFileDialog}>Upload file</button>
			{imageUrl && <img src={imageUrl} />}

			<div style={{ margin: "50px 0px" }}>
				<Editor />
			</div>
		</div>
	);
};

export default Landing;
