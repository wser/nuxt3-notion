<template>
<!-- component -->
<div class="flex flex-col">
  <div class="container mx-auto pt-8">
    <div
      :class="{'light': !darkMode, 'dark': darkMode, }"
      class="h-screen bg-themeBackground "
    >
    
      <div class="flex justify-between p-6 select-none">
        <h1 class="mb-4 text-3xl font-bold 
        dark:text-gray-300">
          Notion content
        </h1>
          
        <div class="switchButton">  
          <label 
            for="toogleA"
            class="flex items-center cursor-pointer"
          >
            <!-- toggle -->
            <div class="relative">
              <!-- input -->
              <input id="toogleA" type="checkbox" class="sr-only" v-model="darkMode" />
              <!-- line -->
              <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
              <!-- dot -->
              <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition">
                <!-- label -->
                <div class="ml-1 text-gray-700 font-medium dark:ml-0">
                  {{ darkMode ? "🌙" : "💡" }}
                </div>
              </div>
            </div>            
          </label>          
        </div>
          
      </div>

      <p class="text-sm pb-4 p-6 
      dark:text-gray-300">
        This is a list of content ideas that are published live. If you would like to see more. VOTE!!!
      </p>


      <div 
        class="max-w-sm rounded overflow-hidden shadow-md m-6 my-1 
        dark:bg-gray-800 dark:border-light-100 dark:border"
        v-for="content in suggestions" :key="content.title"
      >
        <span
          v-for="contentType in content.type"
          :key="contentType.id"
          class="text-gray -ml-1 p-2 rounded text-xs font-bold
          dark:text-gray-600"
          :class="'bg-' + contentType.color + '-200'"
          title="Type"
        >
          {{ contentType.name }}
        </span>

        <div class="px-6 py-4 justify-between
        dark:text-white">
          <div class="font-bold text-xl mb-2 " 
            title="Title">
            {{ content.title }}
          </div>
          <div class="text-xs text-gray-900 
          dark:text-gray-600"
            title="Date">
            {{ dateFormat(content.dateCreated) }}
          </div>
          <p class="text-gray-700 text-base 
          dark:text-gray-300" 
            title="Description">
            {{ content.description }}
          </p>
        </div>

        <div class="px-6 pt-4 pb-2 flex justify-between">
          <div>
            <span
              v-for="tag in content.tags"
              :key="tag.id"
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 
              dark:text-black"
              :class="'bg-' + tag.color + '-200'" 
              title="Tag"
            >
            {{ tag.name }}
            </span>
          </div>

          <div class="content-end -mr-5 " title="Vote">
            <span class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
              {{ content.votes }}
              <button @click="vote(content)" 
                class="text-indigo-400
                hover:text-indigo-900"                
              >Vote</button>
            </span>
          </div>

        </div>

        
      </div>

      
    </div>  

  </div>
</div>






</template>


<script setup lang="ts">
  import { onMounted, watch } from '@vue/runtime-core';

  let suggestions= ref([]);
  const address = "/api/notion"
  const headers = {
    Accept: 'application/json',
    'Notion-Version': '2022-02-22',
    'Content-Type': 'application/json'
  }

  const getData = $fetch(address, {
      method: "GET",
      headers: headers,
    })
    .then(res => suggestions.value = res.suggestions)
    .catch(err => console.error(err));

  const vote = (content) => {
    content.votes++;
    $fetch(address, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(content)
    })
    //.then(response => console.log(content.votes))
    .catch(err => console.error(err));
  }

  const dateFormat = (date) => new Date(date).toISOString().split('T')[0].replaceAll('-', '.')

  const LOCAL_STORAGE_THEME_KEY = 'theme';


type Theme = 'light' | 'dark';
  const darkMode = useState('theme', () => false);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
    darkMode.value = newTheme === 'dark';
  };

  onMounted(() => {
    async () => await getData;

    const isDarkModePreferred = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    const themeFromLocalStorage = localStorage.getItem(
      LOCAL_STORAGE_THEME_KEY
    ) as Theme;

    themeFromLocalStorage ? setTheme(themeFromLocalStorage) : setTheme(isDarkModePreferred ? 'dark' : 'light');
  });

  watch(darkMode, selected => {
    setTheme(selected ? 'dark' : 'light');
  });

</script>

<style>
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
</style>