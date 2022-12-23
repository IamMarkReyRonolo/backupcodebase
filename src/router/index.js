import Vue from "vue";
import VueRouter from "vue-router";
import StaffLoginPage from "../views/Admin/StaffLoginPage.vue";
import StaffMainPage from "../views/Admin/StaffMainPage.vue";
import StaffDashboard from "../views/Admin/StaffDashboard.vue";
import StaffPeople from "../views/Admin/StaffPeople.vue";
import StaffViewQuestions from "../views/Admin/StaffViewQuestions.vue";

import NotFoundPage from "../components/UtilityComponents/NotFoundPage.vue";
Vue.use(VueRouter);

const routes = [
	{
		name: "stafflogin",
		path: "/login/x/staff-admin/",
		component: StaffLoginPage,
		props: {
			header: true,
			content: true,
		},
	},
	{
		path: "/staff",
		component: StaffMainPage,
		name: "staff",
		children: [
			{
				path: "dashboard",
				name: "dashboard",
				component: StaffDashboard,
				props: {
					header: true,
					content: true,
				},
			},
			{
				path: "questions",
				name: "questions",
				component: StaffViewQuestions,
				props: {
					header: true,
					content: true,
				},
			},
			{
				path: "people",
				name: "people",
				component: StaffPeople,
				props: {
					header: true,
					content: true,
				},
			},
		],
	},
	{ path: "*", component: NotFoundPage },
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
