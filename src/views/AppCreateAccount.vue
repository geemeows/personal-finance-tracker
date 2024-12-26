<script setup lang="ts">
import NewAccountForm from '@/components/accounts/NewAccountForm.vue'
</script>

<template>
  <div
    class="container relative hidden h-svh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <img src="@/assets/logo.svg" class="w-6 h-6" />
        Expensify
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;Effortlessly track, manage, and optimize your expenses with Expensify. Whether it's personal
            budgeting or business reimbursements, we've got you covered with smart tools and real-time insights. Stay
            organized, save money, and achieve your financial goals—all in one powerful app.&rdquo;
          </p>
        </blockquote>
      </div>
    </div>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p class="text-sm text-muted-foreground">
            Enter your account details below to start tracking your expenses
          </p>
        </div>
        <NewAccountForm />
      </div>
    </div>
  </div>
</template>
