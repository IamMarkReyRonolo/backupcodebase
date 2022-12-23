<template>
	<div class="peopleList">
		<div class="headerSection">
			<h1 class="componentTitle">People</h1>
			<div class="addBtnCon">
				<v-btn
					large
					dark
					color="#4C5B77"
					class="large"
					@click="activateCreateStaffModal = true"
					id="addStaffBtn"
					>Add Staff</v-btn
				>
				<v-btn
					dark
					small
					color="#4C5B77"
					class="small"
					id="addStaffBtn"
					@click="activateCreateStaffModalMobile = true"
					>Add Staff</v-btn
				>
			</div>
		</div>
		<div class="historyNav">
			<div class="navWrapper">
				<v-btn
					:text="!allSelected"
					color="#EEEEEE"
					tile
					elevation="0"
					class="smallView"
					@click="select('all')"
					id="allPeopleSelectedBtn"
					><span class="vtext">All People</span></v-btn
				>
				<v-btn
					:text="!adminSelected"
					color="#EEEEEE"
					tile
					elevation="0"
					class="smallView"
					@click="select('admins')"
					id="adminSelectedBtn"
					><span class="vtext">Admins</span></v-btn
				>
				<v-btn
					:text="!staffSelected"
					color="#EEEEEE"
					tile
					elevation="0"
					class="smallView"
					id="staffSelectedBtn"
					@click="select('staffs')"
					><span class="vtext">Staffs</span></v-btn
				>
			</div>
		</div>

		<div class="loadingFetch" v-if="peopleStore.loading">
			<Loading />
		</div>
		<div class="fetch" v-if="peopleStore.fetched">
			<div class="notEmpty" v-if="peopleStore.people.length != 0">
				<ListSection />
				<br />
				<div class="paginationCon">
					<v-pagination
						v-model="page"
						:length="pages"
						color="#4c5b77"
						:total-visible="7"
					></v-pagination>
				</div>
			</div>

			<div class="empty" v-if="peopleStore.people.length == 0">
				<Empty />
			</div>
		</div>
		<div class="errorCon" v-if="peopleStore.error">
			<Error @refresh="refresh" />
		</div>

		<CreateStaff
			v-if="activateCreateStaffModal"
			:activateCreateStaffModal="activateCreateStaffModal"
			@cancelCreate="activateCreateStaffModal = false"
			@alertSuccess="alertSuccess"
			@alertError="alertError"
		/>
		<CreateStaffMobile
			v-if="activateCreateStaffModalMobile"
			:activateCreateStaffModalMobile="activateCreateStaffModalMobile"
			@cancelCreate="activateCreateStaffModalMobile = false"
			@alertSuccess="alertSuccess"
			@alertError="alertError"
		/>

		<Snackbar
			:snackbar="snackbar"
			:message="message"
			:status="status"
			@closeSnackbar="snackbar = false"
			v-if="snackbar"
		/>
	</div>
</template>

<script>
	import ListSection from "./ListSection.vue";
	import CreateStaff from "../StaffModals/CreateStaff.vue";
	import CreateStaffMobile from "../StaffModals/CreateStaff-Mobile.vue";
	import Snackbar from "../../../components/GeneralModals/Snackbar.vue";
	import Empty from "../../UtilityComponents/Empty.vue";
	import Error from "../../UtilityComponents/Error.vue";
	import Loading from "../../UtilityComponents/Loading.vue";
	import { usePeopleStore } from "../../../store/PeopleStore";
	export default {
		components: {
			ListSection,
			CreateStaff,
			CreateStaffMobile,
			Snackbar,
			Empty,
			Error,
			Loading,
		},

		async created() {
			await this.getData();
		},
		data: () => ({
			peopleStore: usePeopleStore(),
			allSelected: true,
			adminSelected: false,
			staffSelected: false,
			snackbar: "",
			message: "",
			status: "",
			page: 1,
			pages: 0,
			total: 0,
			pageChanged: false,
			activateCreateStaffModal: false,
			activateCreateStaffModalMobile: false,
		}),
		methods: {
			select(params) {
				if (params == "all") {
					this.allSelected = true;
					this.adminSelected = false;
					this.staffSelected = false;
				}

				if (params == "admins") {
					this.allSelected = false;
					this.adminSelected = true;
					this.staffSelected = false;
				}

				if (params == "staffs") {
					this.allSelected = false;
					this.adminSelected = false;
					this.staffSelected = true;
				}

				this.getData();
			},

			async getData() {
				const params = this.getQueryParams();
				await this.peopleStore.getStaff(params);
				if (!this.peopleStore.error) {
					const data = this.peopleStore.data;
					this.page = data.page;
					this.pages = data.no_of_pages;
					this.total = data.total;
				}
			},

			async getCount() {
				await this.peopleStore.getCount();
			},

			getQueryParams() {
				let params = "";
				let roleChange = false;
				if (this.adminSelected) {
					params = "?role=admin";
					roleChange = true;
				}

				if (this.staffSelected) {
					params = "?role=staff";
					roleChange = true;
				}

				if (this.pageChanged) {
					if (roleChange) {
						params += `&page_num=${this.page}`;
					} else {
						params = `?page_num=${this.page}`;
					}

					this.pageChanged = false;
				}
				return params;
			},

			refresh() {
				this.getData();
			},
			closeCreateModal() {
				this.activateCreateStaffModal = false;
				this.activateCreateStaffModalMobile = false;
			},

			alertSuccess(message) {
				this.snackbar = true;
				this.message = message;
				this.status = "Success";
				this.closeCreateModal();
			},

			alertError(message) {
				this.snackbar = true;
				this.message = message;
				this.status = "Error";
				this.closeCreateModal();
			},
		},
		watch: {
			async page() {
				this.pageChanged = true;
				await this.getData();
			},
		},
	};
</script>

<style scoped>
	.peopleList {
		padding: 0px 20px;
	}
	.headerSection {
		color: #4c5b77;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 0px;
	}

	.componentTitle {
		font-weight: 500;
	}

	.vtext {
		color: #4b5a76;
		font-size: 12px;
	}

	.mainContent {
		border-top: 1px solid #b9b9b9;
	}

	.small {
		display: none;
	}

	.historyNav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.totalPeopleCon {
		font-size: 12px;
		color: #4b5a76;
	}

	.paginationCon {
		padding: 15px;
	}
	@media only screen and (max-width: 650px) {
		.peopleList {
			padding: 10px;
		}

		.componentTitle {
			font-size: 24px;
		}

		.large {
			display: none;
		}

		.small {
			display: block;
		}
	}

	@media only screen and (max-width: 500px) {
		.vtext {
			font-size: 10px;
		}

		.v-btn {
			padding: 0px 10px !important;
		}

		.totalPeopleCon {
			font-size: 10px;
		}
	}
</style>
