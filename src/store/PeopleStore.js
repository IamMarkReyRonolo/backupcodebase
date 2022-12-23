import { defineStore } from "pinia";
import StaffAPI from "../api/StaffAPI";
export const usePeopleStore = defineStore("peopleStore", {
	state: () => ({
		fetched: false,
		loading: false,
		error: null,
		queryLoading: false,
		queryError: false,
		data:{},
		people: [],
		count: {
			admins: 0,
			staffs: 0,
			total: 0,
		},
	}),
	getters: {},
	actions: {

		async getCount() {
			const result = await StaffAPI.prototype.getCount();
			const count = result.data;
			this.count.admins = count.admin_total_count;
			this.count.staffs = count.staff_total_count;
			this.count.total = this.count.admins + this.count.staffs;
		},

		async getStaff(params) {
			try {
				this.loading = true;
				this.fetched = false;
				this.error = null;
				this.data = await StaffAPI.prototype.getAllStaff(params);
				this.people = this.data.data;
				await this.getCount();
				this.loading = false;
				this.fetched = true;
				this.error = null;
			} catch (error) {
				this.loading = false;
				this.fetched = false;
				this.error = error;
			}
			
		},

		async createStaff(staff) {
			try {
				this.queryLoading = true;
				const result = await StaffAPI.prototype.register(staff);
				staff = result.data.staff;
				await this.getCount();
				this.people.unshift(staff);
				this.queryError = false;
				this.queryLoading = false;
				
			} catch (error) {
				this.queryError = error;
				this.queryLoading = false;
			}
		},

		async updateDetails(data) {
			try {
				this.queryLoading = true;
				await StaffAPI.prototype.updateStaffDetails(data);
				this.people.forEach((p) => {
					if (p.uuid == data.uuid) {
						p.first_name = data.first_name;
						p.middle_name = data.middle_name;
						p.last_name = data.last_name;
						p.role = data.role;
						p.email = data.email;
					}
				});
				this.queryLoading = false;
				this.queryError = false
			} catch (error) {
				this.queryError = error
				this.queryLoading = false;
			}
		},

		async changePassword(data) {
			try {
				this.queryLoading = true;
				await StaffAPI.prototype.changeStaffPassword(data);		
				this.queryLoading = false;
				this.queryError = false;
			} catch (error) {
				this.queryError = error;
				this.queryLoading = false;
			}
		},

		async deleteStaff(uuid) {
			try {
				this.queryLoading = true;
				await StaffAPI.prototype.deleteStaff(uuid);
				this.people = this.people.filter((p) => {
					if (p.uuid == uuid) {
						return false;
					}
					return true;
				});

				this.getCount();
				this.queryLoading = false;
				this.queryError = false;
			} catch (error) {
				this.queryLoading = false;
				this.queryError = error;
			}
		},
	},
});
