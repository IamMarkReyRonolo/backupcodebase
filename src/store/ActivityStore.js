import { defineStore } from "pinia";
import ActivityAPI from "../api/ActivityAPI";
import { useAdminAuthStore } from "./AdminAuth";
export const useActivityStore = defineStore("activityStore", {
	state: () => ({
		adminStore: useAdminAuthStore(),
		activities: [],
		loading: false,
		fetched: false,
		error: null,
	}),
	getters: {
		all() {
			return this.activities;
		},
		authored() {
			const data = this.activities.filter((d) => {
				if (d.staff_uuid == this.adminStore.user.uuid) {
					if (d.title == "Create") {
						return true;
					}
				}
			});
			return data;
		},
		edited() {
			const data = this.activities.filter((d) => {
				if (d.staff_uuid == this.adminStore.user.uuid) {
					if (d.title != "Create") {
						return true;
					}
				}
			});
			return data;
		},
	},
	actions: {
		async getActivityHistory() {
			try {
				this.loading = true;
				this.fetched = false;
				this.error = false;
				const results = await ActivityAPI.prototype.getActivities();
				this.activities = results.data;
				this.loading = false;
				this.fetched = true;
				this.error = false;
			} catch (error) {
				this.loading = false;
				this.fetched = false;
				this.error = error;
			}
		},
	},
});
