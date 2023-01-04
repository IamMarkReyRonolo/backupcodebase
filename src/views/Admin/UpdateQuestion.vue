<template>
	<div class="updateQuestionsCon">
		<NavDrawer />
		<NavDrawerMobile />
		<MainView />
	</div>
</template>

<script>
	import NavDrawer from "../../components/StaffComponents/QuestionUpdateComponents/Metadata/NavDrawer.vue";
	import NavDrawerMobile from "../../components/StaffComponents/QuestionUpdateComponents/Metadata/NavDrawerMobile.vue";
	import MainView from "../../components/StaffComponents/QuestionUpdateComponents/MainDetails/MainView.vue";
	import { useQuestionStore } from "../../store/QuestionStore";
	export default {
		components: { NavDrawer, NavDrawerMobile, MainView },
		created() {
			this.questionStore.updatedQuestion = JSON.parse(
				JSON.stringify(this.questionStore.chosenQuestion)
			);

			this.questionStore.updatedQuestion.metadata = JSON.parse(
				JSON.stringify(this.questionStore.chosenQuestion.metadata)
			);

			this.questionStore.updatedQuestion.options = [];
			this.questionStore.chosenQuestion.options.forEach((element) => {
				this.questionStore.updatedQuestion.options.push(
					JSON.parse(JSON.stringify(element))
				);
			});
		},
		data: () => ({
			questionStore: useQuestionStore(),
			fetched: false,
		}),
		methods: {},
	};
</script>

<style>
	.updateQuestionsCon {
		display: flex;
	}
</style>
