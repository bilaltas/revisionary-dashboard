export const state = () => ({
	projectCategories: [
		{
			ID: 0,
			title: "Uncategorized"
		}
	],
	projects: [],
	project: {},
	isLoaded: false
});

export const getters = {
	get(state) {
		return state.projects;
	},
	getCategories(state) {
		return state.projectCategories;
	},
	getProject(state) {
		return state.project;
	},
	status(state) {
		return state.isLoaded;
	}
};

export const actions = {

	// Fetch Project Categories
	async fetchCategories({ commit }) {
		await commit("setLoaded", false);
		await commit("setCategories", [
			{
				ID: 0,
				title: "Uncategorized"
			},
			{
				ID: 1,
				title: "Personal Projects"
			},
			{
				ID: 2,
				title: "Cat 1"
			},
			{
				ID: 3,
				title: "Cat 2"
			},
			{
				ID: 4,
				title: "Cat 33"
			}
		]);
		await commit("setLoaded", true);
	},

	// Fetch Projects
	async fetch({ commit }) {
		await commit("setLoaded", false);
		await commit("set", [
			{
				ID: 21,
				title: "1 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 6,
				order: 1,
				cat_ID: 0,
				favorite: false,
				users: [1, 2, 3]
			},
			{
				ID: 32,
				title: "2 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 6,
				order: 1,
				cat_ID: 4,
				favorite: false,
				users: [1, 2, 3]
			},
			{
				ID: 43,
				title: "3 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 6,
				order: 1,
				cat_ID: 1,
				favorite: false,
				users: [1, 2, 3]
			},
			{
				ID: 54,
				title: "4 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 6,
				order: 1,
				cat_ID: 0,
				favorite: true,
				users: [1, 2, 3]
			},
			{
				ID: 65,
				title: "5 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 6,
				order: 1,
				cat_ID: 1,
				favorite: true,
				users: [1, 2, 3]
			},
			{
				ID: 76,
				title: "6 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 6,
				order: 1,
				cat_ID: 2,
				favorite: true,
				users: [1, 2, 3]
			},
			{
				ID: 78,
				title: "7 Marc Pridmore",
				description: "Lorem ipsum dolor sit amet.",
				image_url: "https://placeimg.com/640/480/any",
				user_ID: 6,
				order: 1,
				cat_ID: 0,
				favorite: false,
				users: [1, 2, 3]
			}
		]);
		await commit("setLoaded", true);

		// await this.$axios
		// 	.get("https://dapi.revisionary.co/v1/projects")
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			//console.log(res.data);
		// 			commit("set", res.data.splice(0, 6));
		// 			commit("setLoaded", true);
		// 		}
		// 	});
	},

	// Get singular project
	async fetchProject({ commit, state }, projectID) {

		// Find the project
		const projectFound = state.projects.find(function (project) {
			return project.ID == projectID;
		});

		if (projectFound) {
			commit("setProject", projectFound);
			return;
		}


		await commit("setLoaded", false);
		await commit("setProject", {
			ID: 3,
			title: "4 Marc Pridmore",
			description: "Lorem ipsum dolor sit amet.",
			image_url: "https://placeimg.com/640/480/any",
			user_ID: 6,
			order: 1,
			cat_ID: 0,
			favorite: true,
			users: [1, 2, 3]
		});
		await commit("setLoaded", true);


		// await commit("setLoaded", false);
		// await this.$axios
		// 	.get(`https://dapi.revisionary.co/v1/projects/${projectID}`)
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			commit("setProject", res.data);
		// 			commit("setLoaded", true);
		// 		}
		// 	});
	},

	// Reset Selected Project
	resetProject({ commit }) {
		commit("setProject", {});
	},

	// Reset Selected Project
	updateProject({ commit }, payload) {

		// DO IT ON BACKEND !!!

		// If successful
		commit("update", payload);

	}
};

export const mutations = {
	set(state, projects) {
		state.projects = projects;
	},
	update(state, payload) {

		const projectID = payload.ID;
		const name = payload.name;
		const value = payload.value;

		// Get the current state of the projects
		let currentProjects = state.projects;

		// Find the index
		const index = currentProjects.findIndex(project => project.ID === projectID);

		if (index > -1) {

			// Modify the project
			currentProjects[index][name] = value;

			// Commit the change
			state.projects = currentProjects;
			return;
		}

		return false;

	},
	setCategories(state, categories) {
		state.projectCategories = categories;
	},
	add(state, project) {
		merge(state.projects, project);
	},
	remove(state, project) {
		state.projects.splice(state.project.indexOf(project), 1);
	},
	setProject(state, project) {
		state.project = project;
	},
	setLoaded(state, status) {
		state.isLoaded = status;
	}
};
