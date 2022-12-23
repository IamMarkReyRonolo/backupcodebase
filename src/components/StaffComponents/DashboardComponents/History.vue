<template>
	<div class="history">
		<div class="historyNav">
			<v-btn
				:text="!generalSelected"
				color="#EEEEEE"
				tile
				elevation="0"
				@click="select('general')"
				class="smallView"
				id="generalHistoryBtn"
				><span class="vtext">General History</span></v-btn
			>
			<v-btn
				:text="!authoredSelected"
				color="#EEEEEE"
				tile
				elevation="0"
				@click="select('authored')"
				class="smallView"
				id="authoredBtn"
				><span class="vtext">Authored by you</span></v-btn
			>
			<v-btn
				:text="!editedSelected"
				color="#EEEEEE"
				tile
				elevation="0"
				@click="select('edited')"
				class="smallView"
				id="editedBtn"
				><span class="vtext">Edited by you</span></v-btn
			>
		</div>

		<div v-if="activityStore.fetched">
			<div class="mainContent" v-if="getData.length != 0">
				<HistoryContent :historyData="getData" />
			</div>

			<div class="emptyCon" v-if="getData.length == 0">
				<Empty />
			</div>
		</div>
		<div class="loadingCon" v-if="activityStore.loading">
			<v-progress-circular :size="75" color="#4B5A76" indeterminate>
			</v-progress-circular>
		</div>
		<div class="errorCon" v-if="activityStore.error">
			<Error @refresh="refresh" />
		</div>
	</div>
</template>

<script>
	import HistoryContent from "./HistoryContent.vue";
	import Empty from "../../UtilityComponents/Empty.vue";
	import Error from "../../UtilityComponents/Error.vue";
	import { useActivityStore } from "../../../store/ActivityStore";

	export default {
		components: {
			HistoryContent,
			Empty,
			Error
		},
		async created() {
			await this.activityStore.getActivityHistory();
		},
		data: () => ({
			activityStore: useActivityStore(),
			generalSelected: true,
			authoredSelected: false,
			editedSelected: false,
		}),
		methods: {
			select(params) {
				if (params == "general") {
					this.generalSelected = true;
					this.authoredSelected = false;
					this.editedSelected = false;
				}

				if (params == "authored") {
					this.generalSelected = false;
					this.authoredSelected = true;
					this.editedSelected = false;
				}

				if (params == "edited") {
					this.generalSelected = false;
					this.authoredSelected = false;
					this.editedSelected = true;
				}
			},
			async refresh(){
				await this.activityStore.getActivityHistory();
			}
		},

		computed: {
			getData: function () {
				if (this.generalSelected) {
					return this.activityStore.all;
				}

				if (this.authoredSelected) {
					return this.activityStore.authored;
				}

				if (this.editedSelected) {
					return this.activityStore.edited;
				}
			},
		},
	};
</script>

<style scoped>
	.history {
		padding: 20px 0px;
	}

	.vtext {
		color: #4b5a76;
		font-size: 12px;
	}

	.mainContent {
		border-top: 1px solid #b9b9b9;
	}

	.emptyCon {
		padding: 40px 0px;
	}

	.loadingCon {
		width: 300px;
		padding: 40px;
		text-align: center;
		margin: auto;
		
	}

	.errorCon{
		padding: 40px;
	}

	@media only screen and (max-width: 500px) {
		.vtext {
			font-size: 10px;
		}

		.v-btn {
			padding: 0px 10px !important;
		}
	}
</style>
