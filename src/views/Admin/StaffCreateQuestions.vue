<template>
	<div class="createQuestionsCon">
		<div class="fetched" v-if="!questionStore.loadingCreate">
			<NavDrawer />
			<NavDrawerMobile />
			<MainView />

			<Snackbar
				:snackbar="questionStore.snackbar"
				:message="questionStore.message"
				:status="questionStore.status"
				v-if="questionStore.snackbar"
				@closeSnackbar="questionStore.snackbar = false"
			/>
		</div>
		<div class="loading" v-if="questionStore.loadingCreate">
			<v-progress-circular :size="75" color="#4B5A76" indeterminate>
			</v-progress-circular>
		</div>
	</div>
</template>

<script>
	import NavDrawer from "../../components/StaffComponents/QuestionCreateComponents/Metadata/NavDrawer.vue";
	import NavDrawerMobile from "../../components/StaffComponents/QuestionCreateComponents/Metadata/NavDrawerMobile.vue";
	import MainView from "../../components/StaffComponents/QuestionCreateComponents/MainDetails/MainView.vue";
	import { useQuestionStore } from "../../store/QuestionStore";
	import Snackbar from "../../components/GeneralModals/Snackbar";
	export default {
		components: { NavDrawer, NavDrawerMobile, MainView, Snackbar },
		created() {
			this.questionStore.createSuccess = false;
			this.questionStore.message = "";
			this.questionStore.snackbar = false;
			this.questionStore.status = "";
		},
		data: () => ({
			questionStore: useQuestionStore(),
		}),
		methods: {},
		destroyed() {
			this.questionStore.resetCreateQuestion();
		},
	};
</script>

<style scoped>
	.fetched {
		display: flex;
	}

	.loading {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
