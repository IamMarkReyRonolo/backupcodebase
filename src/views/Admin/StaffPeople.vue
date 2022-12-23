<template>
	<div class="mainPeopleCon">
		<div>
			<div class="peopleCon">
				<div class="peopleHeaderSection">
					<div class="profileSection">
						<div class="profImageCon largeView">
							<v-avatar size="100" color="#4C5B77"
								><span style="color: white; font-size: 24px"
									>{{ user.first_name.split("")[0]
									}}{{ user.last_name.split("")[0] }}</span
								></v-avatar
							>
						</div>

						<div class="profImageCon smallView">
							<v-avatar size="80" color="#4C5B77"
								><span style="color: white; font-size: 24px"
									>{{ user.first_name.split("")[0]
									}}{{ user.last_name.split("")[0] }}</span
								></v-avatar
							>
						</div>

						<div class="profileDetailsCon">
							<div class="nameCon">
								{{ user.first_name }} {{ user.middle_name.split("")[0] }}.
								{{ user.last_name }}
							</div>
							<div class="roleCon">{{ user.role }}</div>
							<div class="editBtnCon">
								<v-btn
									dark
									rounded
									color="#4C5B77"
									x-small
									class="smallView"
									@click="activateEditProfileMobileModal = true"
									id="editProfileBtn"
									>Edit Profile</v-btn
								>
							</div>
						</div>
						<div class="editBtnCon">
							<v-btn
								dark
								color="#4C5B77"
								class="largeView"
								id="editProfileBtn"
								@click="activateEditProfileModal = true"
								>Edit Profile</v-btn
							>
						</div>
					</div>

					<div class="statsSection">
						<div class="stat">
							<div class="statIcon">
								<v-icon color="#4C5B77" size="40">mdi-contacts</v-icon>
							</div>
							<div class="statData" v-if="count.admins > 1" id="adminCount">
								{{ this.count.admins }} Admins
							</div>
							<div class="statData" v-if="count.admins < 2" id="adminCount">
								{{ this.count.admins }} Admin
							</div>
						</div>
						<div class="stat">
							<div class="statIcon">
								<v-icon color="#4C5B77" size="40">mdi-contacts-outline</v-icon>
							</div>
							<div class="statData" v-if="count.staffs > 1" id="staffCount">
								{{ this.count.staffs }} Staffs
							</div>
							<div class="statData" v-if="count.staffs < 2" id="staffCount">
								{{ this.count.staffs }} Staff
							</div>
						</div>
						<div class="stat">
							<div class="statIcon">
								<v-icon color="#4C5B77" size="40"
									>mdi-clipboard-list-outline</v-icon
								>
							</div>
							<div class="statData" id="totalCount">
								{{ this.count.total }} Total
							</div>
						</div>
					</div>
				</div>

				<div class="peopleSection">
					<PeopleList />
				</div>

				<EditProfile
					v-if="activateEditProfileModal"
					:activateEditProfileModal="activateEditProfileModal"
					@cancelEdit="activateEditProfileModal = false"
					@updateProfile="updateProfile"
					@changeProfilePassword="changeProfilePassword"
				/>

				<EditProfileMobile
					v-if="activateEditProfileMobileModal"
					:activateEditProfileMobileModal="activateEditProfileMobileModal"
					@cancelEdit="activateEditProfileMobileModal = false"
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
		</div>
	</div>
</template>

<script>
	import PeopleList from "../../components/StaffComponents/PeoplePageComponents/PeopleList.vue";
	import EditProfile from "../../components/StaffComponents/StaffModals/EditProfile.vue";
	import EditProfileMobile from "../../components/StaffComponents/StaffModals/EditProfile-Mobile.vue";
	import Snackbar from "../../components/GeneralModals/Snackbar.vue";
	import { useAdminAuthStore } from "../../store/AdminAuth";
	import { usePeopleStore } from "../../store/PeopleStore";
	export default {
		components: { PeopleList, EditProfile, EditProfileMobile, Snackbar },
		async created() {
			this.user = this.adminStore.user;
			this.count = this.peopleStore.count;
		},
		data: () => ({
			adminStore: useAdminAuthStore(),
			peopleStore: usePeopleStore(),
			activateEditProfileModal: false,
			activateEditProfileMobileModal: false,
			user: null,
			count: {
				admins: 0,
				staffs: 0,
				total: 0,
			},
			snackbar: false,
			message: "",
			status: "",
		}),
		methods: {
			showSnackbar(params) {
				this.snackbar = params.activate;
				this.message = params.message;
				this.status = params.status;
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
	};
</script>

<style scoped>
	.peopleCon {
		padding: 40px;
	}

	.peopleHeaderSection {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
	}
	.profileSection {
		display: flex;

		width: 700px;

		justify-content: flex-start;
		align-items: center;
		color: #4c5b77;
	}

	.profileSection div {
		margin: 0px 10px;
	}

	.nameCon {
		font-size: 24px;
		font-weight: 500;
	}

	.roleCon {
		font-size: 16px;
	}

	.statsSection {
		color: #4c5b77;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.stat {
		padding: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.statData {
		font-size: 16px;
		font-weight: 500;
		padding: 0px 5px;
	}

	.smallView {
		display: none;
	}

	.loading {
		text-align: center;
		margin: 200px 0px;
	}

	@media only screen and (max-width: 1250px) {
		.profileSection {
			width: 500px;
		}

		.profileSection div {
			margin: 0px 5px;
		}

		.nameCon {
			font-size: 20px;
			font-weight: 500;
		}

		.roleCon {
			font-size: 14px;
		}

		.mdi:before,
		.mdi-set {
			font: normal normal normal 24px/1 "Material Design Icons";
		}

		/* .editBtnCon .v-btn {
			height: 26px;
			font-size: 12px;
		} */
	}

	@media only screen and (max-width: 1020px) {
		.peopleHeaderSection {
			flex-direction: column;
		}

		.profileSection {
			margin-bottom: 20px;
		}
	}

	@media only screen and (max-width: 650px) {
		.peopleCon {
			padding: 10px;
		}

		.peopleHeaderSection {
			padding: 20px 10px;
		}
		.profileSection {
			width: 300px;
			padding: 20px 0px;
		}
		.smallView {
			margin-top: 10px;
			margin-bottom: -20px;
			display: block;
		}

		.largeView {
			display: none;
		}

		.statData {
			font-size: 14px;
			font-weight: 500;
			padding: 0px 5px;
		}

		.mdi:before,
		.mdi-set {
			font: normal normal normal 20px/1 "Material Design Icons";
		}
	}
</style>
