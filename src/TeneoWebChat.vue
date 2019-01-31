<template>
  <div>
    <p>
      {{ message }}
    </p>
    <p class="teneo-web-chat__arrow">➡</p>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
    />
  </div>
</template>

<script src="./teneo-web-chat.js"></script>
<style scoped src="./teneo-web-chat.css"></style>
