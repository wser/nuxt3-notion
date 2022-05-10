<template>
<!-- component -->
<div class="flex flex-col">
  <div class="container mx-auto pt-8">
      <!-- <h1 class="mb-4 text-3xl font-bold">{{ suggestions['title'][0]['plain_text'] }}</h1> -->
      <p class="text-sm pb-4">This is a list of content ideas. If you would like to see more. VOTE!!!</p>
      <div class="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-gray">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Created
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Votes
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="content in suggestions" :key="content.title">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ content.title }}
                          </div>
                        
                        </div>
                      </div>
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ content.description }}</div>
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        v-for="contentType in content.type" 
                        :key="contentType.id"
                        class="text-gray py-1 px-2 rounded text-xs font-bold ml-1"
                        :class="'bg-' + contentType.color + '-200'" >
                      {{ contentType.name }}
                      </span>
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        v-for="tag in content.tags" 
                        :key="tag.id"
                        class="text-gray py-1 px-2 rounded text-xs font-bold ml-1"
                        :class="'bg-' + tag.color + '-200'" >
                      {{ tag.name }}
                      </span>
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ dateFormat(content.dateCreated) }}</div>
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ content.votes }}
                      <button @click="vote(content)" class="text-indigo-400 hover:text-indigo-900">Vote</button>
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ content.status }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
  let suggestions= ref([]);
  const address = "/api/notion"
  const headers = {
    Accept: 'application/json',
    'Notion-Version': '2022-02-22',
    'Content-Type': 'application/json'
  }

  onMounted(async () => {
    const response = await $fetch(address);
    suggestions.value = response.suggestions;
    console.log(response)
  })

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

</script>