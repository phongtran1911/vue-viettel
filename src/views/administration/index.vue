<template>
  <div class="app-container">
    <vue-form-generator :schema="schema" :model="model" :options="formOptions" />
  </div>
</template>

<script>
import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'

Vue.use(VueFormGenerator)

export default {
  data() {
    return {
      model: {
        id: 1,
        name: 'John Doe',
        password: 'J0hnD03!x4',
        skills: ['Javascript', 'VueJS'],
        email: 'john.doe@gmail.com',
        status: true
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'ID (disabled text field)',
            model: 'id',
            readonly: true,
            disabled: true
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Name',
            model: 'name',
            placeholder: 'Your name',
            featured: true,
            required: true
          },
          {
            type: 'input',
            inputType: 'password',
            label: 'Password',
            model: 'password',
            min: 6,
            required: true,
            hint: 'Minimum 6 characters',
            validator: VueFormGenerator.validators.string
          },
          {
            type: 'checklist',
            label: 'Skills',
            model: 'skills',
            multi: true,
            required: true,
            multiSelect: true,
            values: [
              'HTML5',
              'Javascript',
              'CSS3',
              'CoffeeScript',
              'AngularJS',
              'ReactJS',
              'VueJS'
            ]
          },
          {
            type: 'input',
            inputType: 'email',
            label: 'E-mail',
            model: 'email',
            placeholder: "User's e-mail address"
          },
          {
            type: 'checkbox',
            label: 'Status',
            model: 'status',
            default: true
          }
        ]
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateAsync: true
      },
      methods: {
        prettyJSON: function(json) {
          if (json) {
            json = JSON.stringify(json, undefined, 4)
            json = json
              .replace(/&/g, '&')
              .replace(/</g, '<')
              .replace(/>/g, '>')
            return json.replace(
              /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
              function(match) {
                var cls = 'number'
                if (/^"/.test(match)) {
                  if (/:$/.test(match)) {
                    cls = 'key'
                  } else {
                    cls = 'string'
                  }
                } else if (/true|false/.test(match)) {
                  cls = 'boolean'
                } else if (/null/.test(match)) {
                  cls = 'null'
                }
                return '<span class="' + cls + '">' + match + '</span>'
              }
            )
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
 .vue-form-generator fieldset {
  border-width: 0px;
  border-style: groove;
  border-color: threedface;
  border-image: initial;
}
</style>
