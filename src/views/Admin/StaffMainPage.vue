<template>
	<div>
		<div class="mainContentDiv" v-if="adminStore.fetched">
			<div class="navigations">
				{{ navigate }}

				<div class="burgerNav">
					<v-navigation-drawer
						v-model="drawer"
						absolute
						temporary
						:z-index="30"
					>
						<div class="titleCon" style="text-align: center; padding-top: 20px">
							<span class="math">Math</span><span class="world">World</span>
						</div>
						<br />
						<v-btn
							color="#253759"
							dark
							:text="!dashboardSelected"
							@click="select('dashboard')"
							to="/staff/dashboard"
							id="dashboardNavBtn"
							block
							tile
							large
							><span class="vtext">Dashboard</span></v-btn
						>

						<v-btn
							color="#253759"
							dark
							:text="!questionsSelected"
							@click="select('questions')"
							to="/staff/questions"
							id="viewQuestionsNavBtn"
							block
							tile
							large
							><span class="vtext">All Questions</span></v-btn
						>
						<v-btn
							color="#253759"
							dark
							:text="!createSelected"
							@click="select('create')"
							to="/staff/create"
							id="createQuestionNavBtn"
							block
							tile
							large
							><span class="vtext">Create Question</span></v-btn
						>

						<v-btn
							color="#253759"
							dark
							:text="!peopleSelected"
							@click="select('people')"
							to="/staff/people"
							id="peopleNavBtn"
							block
							tile
							large
							v-if="adminStore.user.role != 'staff'"
							><span class="vtext">People</span></v-btn
						>
					</v-navigation-drawer>

					<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
				</div>

				<div class="titleCon">
					<span class="math">Math</span><span class="world">World</span>
				</div>

				<div class="lineNav">
					<v-btn
						color="#253759"
						dark
						:text="!dashboardSelected"
						@click="select('dashboard')"
						to="/staff/dashboard"
						id="dashboardNavBtn"
						><span class="vtext">Dashboard</span></v-btn
					>

					<v-btn
						color="#253759"
						dark
						:text="!questionsSelected"
						@click="select('questions')"
						to="/staff/questions"
						id="viewQuestionsNavBtn"
						><span class="vtext">All Questions</span></v-btn
					>
					<v-btn
						color="#253759"
						dark
						:text="!createSelected"
						@click="select('create')"
						to="/staff/create"
						id="createQuestionNavBtn"
						><span class="vtext">Create Question</span></v-btn
					>

					<v-btn
						color="#253759"
						dark
						:text="!peopleSelected"
						@click="select('people')"
						to="/staff/people"
						id="peopleNavBtn"
						v-if="adminStore.user.role != 'staff'"
						><span class="vtext">People</span></v-btn
					>
				</div>

				<v-spacer></v-spacer>
				<ProfileMenu
					@activateEditProfileModal="activateEditProfileModal = true"
				/>
			</div>
			<div class="mainView">
				<router-view />
			</div>

			<EditProfile
				v-if="activateEditProfileModal"
				:activateEditProfileModal="activateEditProfileModal"
				@cancelEdit="activateEditProfileModal = false"
				@updateProfile="updateProfile"
				@changeProfilePassword="changeProfilePassword"
			/>

			<Snackbar
				:snackbar="snackbar"
				:message="message"
				:status="status"
				@closeSnackbar="snackbar = false"
				v-if="snackbar"
			/>
		</div>
		<div class="loadingConSignIn" v-if="adminStore.loading">
			<v-progress-circular :size="75" color="#4B5A76" indeterminate>
			</v-progress-circular>
		</div>
		<div class="errorConSignIn" v-if="adminStore.error">
			<div class="noInternet" v-if="noInternet">
				<NoInternet />
			</div>
			<div v-else>
				<h3 style="font-weight: lighter; padding: 20px">
					An Error Occured. That's all we know. Please reload the page.
				</h3>
			</div>
		</div>
		<div class="accessDenied" v-if="adminStore.accessdenied">
			<AccessDenied />
		</div>
	</div>
</template>

<script>
	import ProfileMenu from "../../components/StaffComponents/DashboardComponents/ProfileMenu.vue";
	import EditProfile from "../../components/StaffComponents/StaffModals/EditProfile.vue";
	import Snackbar from "../../components/GeneralModals/Snackbar.vue";
	import AccessDenied from "../../components/UtilityComponents/AccessDenied.vue";
	import NoInternet from "../../components/UtilityComponents/NoInternet.vue";
	import { useAdminAuthStore } from "../../store/AdminAuth";
	export default {
		components: {
			ProfileMenu,
			EditProfile,
			Snackbar,
			AccessDenied,
			NoInternet,
		},

		async created() {
			if (localStorage.getItem("token")) {
				await this.adminStore.checkIfAuthenticated();
				if (this.adminStore.error) {
					this.handleAuthError(this.adminStore.error);
				}
				if (this.$route.name == "staff") {
					this.$router.push({
						name: "dashboard",
					});
				}
			} else {
				this.$router.push("/login/x/staff-admin/");
			}
		},

		data: () => ({
			adminStore: useAdminAuthStore(),
			dashboardSelected: true,
			createSelected: false,
			questionsSelected: false,
			peopleSelected: false,
			drawer: false,
			activateEditProfileModal: false,
			snackbar: false,
			message: "",
			status: "",
			waitingToUpdate: false,
			noInternet: false,
		}),
		methods: {
			select(selected) {
				if (selected == "dashboard" && !this.dashboardSelected) {
					this.dashboardSelected = true;
					this.createSelected = false;
					this.questionsSelected = false;
					this.peopleSelected = false;
				}

				if (selected == "create" && !this.createSelected) {
					this.dashboardSelected = false;
					this.createSelected = true;
					this.questionsSelected = false;
					this.peopleSelected = false;
				}

				if (selected == "questions" && !this.questionsSelected) {
					this.dashboardSelected = false;
					this.createSelected = false;
					this.questionsSelected = true;
					this.peopleSelected = false;
				}

				if (selected == "people" && !this.peopleSelected) {
					this.dashboardSelected = false;
					this.createSelected = false;
					this.questionsSelected = false;
					this.peopleSelected = true;
				}
			},

			showSnackbar(params) {
				this.snackbar = params.activate;
				this.message = params.message;
				this.status = params.status;
			},

			handleAuthError(error) {
				if (error.request.status == 403 || error.request.status == 404) {
					localStorage.removeItem("token");
					const expired_token = true;
					this.$router.push({
						name: "stafflogin",
						params: { expired_token: expired_token },
					});
				}

				if (error.message == "Network Error") {
					this.noInternet = true;
				}
			},

			async updateProfile(email) {
				await this.adminStore.updateUserEmail(email);

				if (this.adminStore.error) {
					this.status = "Error";
					this.message = "Update error. Try again.";
					this.snackbar = true;
				} else {
					this.status = "Success";
					this.message = "Successfully updated username";
					this.snackbar = true;
					this.activateEditProfileModal = false;
					this.activateEditProfileMobileModal = false;
				}
			},

			async changeProfilePassword(updated) {
				await this.adminStore.updateUserPassword(updated);

				if (this.adminStore.error) {
					this.status = "Error";
					this.message = "Password is incorrect";
					this.snackbar = true;
				} else {
					this.snackbar = true;
					this.status = "Success";
					this.message = "Successfully changed the password";
					this.activateEditProfileModal = false;
					this.activateEditProfileMobileModal = false;
				}
			},
		},
		computed: {
			navigate: function () {
				if (this.$route.name == "dashboard") {
					this.dashboardSelected = true;
					this.createSelected = false;
					this.questionsSelected = false;
					this.peopleSelected = false;
				}
				if (this.$route.name == "create-question") {
					this.dashboardSelected = false;
					this.createSelected = true;
					this.questionsSelected = false;
					this.peopleSelected = false;
				}
				if (this.$route.name == "questions") {
					this.dashboardSelected = false;
					this.createSelected = false;
					this.questionsSelected = true;
					this.peopleSelected = false;
				}

				if (this.$route.name == "people") {
					this.dashboardSelected = false;
					this.createSelected = false;
					this.questionsSelected = false;
					this.peopleSelected = true;
				}
			},
		},
	};
</script>

<style>
	.titleCon {
		font-size: 24px;
		padding-right: 20px;
	}

	.math {
		font-weight: 500;
		color: #4f5d79;
	}
	.vtext {
		text-transform: capitalize;
	}

	.navigations {
		padding: 20px 40px;
		padding-bottom: 0px;
		display: flex;
		align-items: center;
	}

	.burgerNav {
		display: none;
	}

	.lineNav {
		display: flex;
	}

	.loadingConSignIn {
		width: 300px;
		margin: auto;
		text-align: center;
		min-height: 80vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	@media only screen and (max-width: 900px) {
		.lineNav {
			display: none;
		}

		.burgerNav {
			display: block;
		}
	}

	@media only screen and (max-width: 650px) {
		.navigations {
			padding: 20px 10px;
			padding-bottom: 0px;
			color: #4c5b77;
		}
	}
</style>
