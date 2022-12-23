<template>
	<div class="contentCon">
		<div class="contentHeader">
			<div class="header1">Name</div>
			<div class="header2">Role</div>
			<div class="header3">Email</div>
		</div>

		<div class="contentListData">
			<v-btn
				large
				block
				tile
				text
				class="dataCon large"
				v-for="(data, n) in peopleStore.people"
				:key="n"
				:id="'selectUserId' + data.id"
			>
				<span class="content contentData1">
					<v-avatar size="30" color="#596781" dark style="margin-right: 10px"
						><span style="color: white"
							>{{ data.first_name.split("")[0]
							}}{{ data.last_name.split("")[0] }}</span
						></v-avatar
					>{{ data.first_name }} {{ data.middle_name.split("")[0] }}.
					{{ data.last_name }}</span
				><span class="content contentData2"
					><v-chip x-small color="#4B5A76" dark v-if="data.role == 'admin'">{{
						data.role
					}}</v-chip>
					<v-chip x-small color="warning" dark v-if="data.role == 'staff'">{{
						data.role
					}}</v-chip> </span
				><span class="content contentData3"
					>{{ data.email }}

					<span class="largeView"
						><v-btn
							x-small
							color="#4B5A76"
							dark
							@click="viewData(data, 'activateViewStaffModal')"
							:id="'viewUserId' + data.id"
							>view</v-btn
						>
						<v-btn
							x-small
							color="error"
							dark
							@click="activateDeleteDialog(data)"
							:id="'deleteUserId' + data.id"
							v-if="userID != data.id"
							>delete</v-btn
						>
						<span v-if="userID == data.id">(You)</span>
					</span></span
				>
			</v-btn>
		</div>

		<div class="contentListData">
			<div class="listData" v-for="(data, n) in peopleStore.people" :key="n + 's'">
				<v-btn
					large
					tile
					text
					class="dataCon small"
					@click="viewData(data, 'activateViewStaffModalMobile')"
					:id="'selectUserId' + data.id"
				>
					<span class="content contentData1"
						>{{ data.first_name }} {{ data.middle_name.split("")[0] }}.
						{{ data.last_name }}</span
					><span class="content contentData2"
						><v-chip x-small color="#4B5A76" dark v-if="data.role == 'admin'">{{
							data.role
						}}</v-chip>
						<v-chip x-small color="warning" dark v-if="data.role == 'staff'">{{
							data.role
						}}</v-chip> </span
					><span class="content contentData3">{{ data.email }} </span>
				</v-btn>
				<v-spacer></v-spacer>
				<span class="deleteBtn small"
					><v-btn
						x-small
						fab
						color="error"
						dark
						@click="activateDeleteDialog(data)"
						:id="'deleteUserId' + data.id"
						v-if="userID != data.id"
						><v-icon>mdi-trash-can-outline</v-icon></v-btn
					>
					<span v-if="userID == data.id" style="color: #5a6882; font-size: 12px"
						>(You)</span
					>
				</span>
			</div>
		</div>

		<EditStaff
			v-if="activateViewStaffModal"
			:staffData="selectedStaff"
			:activateViewStaffModal="activateViewStaffModal"
			@cancelViewModal="cancelViewModal"
			@alertSuccess="alertSuccess"
			@alertError="alertError"
		/>

		<EditStaffMobile
			v-if="activateViewStaffModalMobile"
			:staffData="selectedStaff"
			:activateViewStaffModalMobile="activateViewStaffModalMobile"
			@cancelViewModal="cancelViewModal"
			@alertSuccess="alertSuccess"
			@alertError="alertError"
		/>

		<DeleteModal
			v-if="deleteDialog"
			:deleteDialog="deleteDialog"
			@cancelDelete="deleteDialog = false"
			@deleteConfirmed="deleteStaff"
			message="Do you want to delete this account? This action cannot be undone."
			:title="'Delete Account?'"
			:loading="peopleStore.queryLoading"
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
	import EditStaff from "../StaffModals/EditStaff.vue";
	import EditStaffMobile from "../StaffModals/EditStaff-Mobile.vue";
	import DeleteModal from "../../../components/GeneralModals/DeleteModal.vue";
	import Snackbar from "../../../components/GeneralModals/Snackbar.vue";
	import { useAdminAuthStore } from "../../../store/AdminAuth";
	import { usePeopleStore } from "../../../store/PeopleStore";
	export default {
		components: {
			EditStaffMobile,
			EditStaff,
			DeleteModal,
			Snackbar
		},
		created(){
			this.userID = this.adminStore.user.id;
		},
		data: () => ({
			adminStore: useAdminAuthStore(),
			peopleStore: usePeopleStore(),
			selectedStaff: {},
			deleteDialog: false,
			snackbar: "",
			message: "",
			status: "",
			activateViewStaffModalMobile: false,
			activateViewStaffModal: false,

		}),
		methods: {
			viewData(data, selector) {
				this.selectedStaff = data;
				if (selector == "activateViewStaffModal") {
					this.activateViewStaffModal = true;
				}

				if (selector == "activateViewStaffModalMobile") {
					this.activateViewStaffModalMobile = true;
				}
			},

			cancelViewModal() {
				this.activateViewStaffModalMobile = false;
				this.activateViewStaffModal = false;
			},

			activateDeleteDialog(data) {
				this.selectedStaff = data;
				this.deleteDialog = true;
			},

			async deleteStaff() {
				await this.peopleStore.deleteStaff(this.selectedStaff.uuid)
				this.deleteDialog = false;
				if(this.peopleStore.queryError){
					this.alertError("Delete Failed. Please try again.")
				}else{
					this.alertSuccess("Successfully deleted.")
				}
			},

			alertSuccess(message){
				this.snackbar = true;
				this.message = message;
				this.status = "Success";
			},

			alertError(message){
				this.snackbar = true;
				this.message = message;
				this.status = "Error";
			}

		},
	};
</script>

<style scoped>
	.contentCon {
		padding: 10px 0px;
		border-top: 1px solid #b9b9b9;
	}

	.contentHeader {
		width: 100%;
		padding: 10px 10px;
		display: flex;
	}

	.header1,
	.header2,
	.header3,
	.header4 {
		color: #4c5b77;
		font-size: 12px;
		padding-left: 10px;
	}

	.header1,
	.header2,
	.contentData1,
	.contentData2 {
		width: 25%;
		text-align: left;
	}

	.contentData3 {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.contentData3,
	.header3 {
		width: 50%;
	}

	.content {
		color: #4c5b77;
	}

	.dataCon {
		display: flex;
		justify-content: flex-start;
		font-size: 12px;
	}

	.v-btn:not(.v-btn--round).v-size--default {
		padding-left: 10px;
	}

	.contentData4,
	.contentData3 {
		padding: 0px 12px;
	}

	.contentData3,
	.contentData4 {
		text-transform: none;
	}

	.small {
		display: none;
	}

	.largeView .v-btn {
		margin-right: 10px;
	}

	@media only screen and (max-width: 1020px) {
		.dataCon {
			font-size: 10px;
		}

		.header1,
		.header2,
		.contentData1,
		.contentData2 {
			width: 30%;
		}

		.contentData3,
		.header3 {
			width: 40%;
		}
	}

	@media only screen and (max-width: 800px) {
		.header2,
		.header3,
		.contentData2,
		.contentData3 {
			width: 30%;
		}

		.listData {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.listData .v-btn,
		.contentHeader {
			width: 90%;
		}

		.deleteBtn .v-btn {
			width: 30px;
		}

		.header1,
		.contentData1 {
			width: 40%;
		}

		.header4,
		.contentData4 {
			display: none;
		}

		.v-btn {
			padding: 0px;
		}

		.largeView {
			display: none;
		}

		.large {
			display: none;
		}

		.small {
			display: block;
		}
	}

	@media only screen and (max-width: 650px) {
		.dataCon {
			font-size: 10px;
		}

		.contentHeader {
			padding: 10px 0px;
		}

		.header1,
		.header2,
		.header3 {
			padding-left: 0px;
		}

		.contentListData .v-btn {
			padding: 0px;
		}

		.large {
			display: none;
		}

		.small {
			display: block;
		}

		.header3,
		.contentData3 {
			display: none;
		}

		.header2,
		.contentData2 {
			width: 50%;
		}

		.header1,
		.contentData1 {
			width: 50%;
		}
	}
</style>
