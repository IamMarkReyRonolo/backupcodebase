<template>
	<div
		class="drawerNavigationsCon"
		v-if="this.$vuetify.breakpoint.width > 1000"
	>
		<v-navigation-drawer
			v-model="drawer"
			:mini-variant.sync="mini"
			permanent
			width="375"
		>
			<div class="drawer">
				<v-btn
					fab
					@click.stop="mini = !mini"
					filled
					class="drawerBtn"
					small
					id="drawerBtn"
				>
					<v-icon color="#4c5b77" v-if="mini">mdi-forwardburger</v-icon>
					<v-icon color="#4c5b77" v-if="!mini">mdi-backburger</v-icon>
				</v-btn>
				<QuestionMetdata v-if="!mini" />
			</div>
		</v-navigation-drawer>
	</div>
</template>

<script>
	import QuestionMetdata from "./QuestionMetadata.vue";
	export default {
		components: { QuestionMetdata },
		data: () => ({
			drawer: false,
			mini: false,
		}),
		methods: {},
	};
</script>

<style scoped>
	.drawer {
		display: flex;
	}

	.drawerBtn {
		margin: 20px 0px;
		margin-left: 10px;
	}
</style>
