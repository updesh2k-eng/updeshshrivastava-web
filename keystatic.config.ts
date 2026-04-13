import { config, collection, fields } from '@keystatic/core';

export default config({
  storage:
    process.env.KEYSTATIC_GITHUB_CLIENT_ID
      ? {
          kind: 'github' as const,
          repo: {
            owner: 'updesh2k-eng',
            name: 'updeshshrivastava-web',
          },
        }
      : { kind: 'local' as const },

  ui: {
    brand: {
      name: 'Updesh · Blog Admin',
    },
  },

  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',

      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
        }),
        date: fields.date({
          label: 'Publish Date',
          validation: { isRequired: true },
        }),
        excerpt: fields.text({
          label: 'Excerpt',
          description: 'Short description shown on the blog listing page.',
          multiline: true,
          validation: { isRequired: true },
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value || 'Tag',
          }
        ),
        readTime: fields.text({
          label: 'Read Time',
          description: 'e.g. "5 min read"',
          defaultValue: '',
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
          description: 'Optional hero image for the post.',
        }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts/',
            },
          },
          components: {},
        }),
      },
    }),
  },
});
