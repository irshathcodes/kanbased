import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import { tags } from '@lezer/highlight'

export const themeExtension = (): Extension => {
  const extension = syntaxHighlighting(
    HighlightStyle.define([
      // ordered by lowest to highest precedence
      {
        tag: tags.atom,
        color: 'var(--syntax-atom-color)',
      },
      {
        tag: tags.meta,
        color: 'var(--syntax-meta-color)',
      },
      // emphasis types
      {
        tag: tags.emphasis,
        color: 'var(--syntax-emphasis-color)',
        fontStyle: 'var(--syntax-emphasis-font-style)',
      },
      {
        tag: tags.strong,
        color: 'var(--syntax-strong-color)',
        fontWeight: 'var(--syntax-strong-font-weight)',
      },
      {
        tag: tags.strikethrough,
        color: 'var(--syntax-strikethrough-color)',
        textDecoration: 'var(--syntax-strikethrough-text-decoration)',
      },
      // comment group
      {
        tag: tags.comment,
        color: 'var(--syntax-comment-color)',
        fontStyle: 'var(--syntax-comment-font-style)',
      },
      // monospace
      {
        tag: tags.monospace,
        color: 'var(--syntax-code-color)',
        fontFamily: 'var(--syntax-code-font-family)',
      },
      // name group
      {
        tag: tags.name,
        color: 'var(--syntax-name-color)',
      },
      {
        tag: tags.labelName,
        color: 'var(--syntax-name-label-color)',
      },
      {
        tag: tags.propertyName,
        color: 'var(--syntax-name-property-color)',
      },
      {
        tag: tags.definition(tags.propertyName),
        color: 'var(--syntax-name-property-definition-color)',
      },
      {
        tag: tags.variableName,
        color: 'var(--syntax-name-variable-color)',
      },
      {
        tag: tags.definition(tags.variableName),
        color: 'var(--syntax-name-variable-definition-color)',
      },
      {
        tag: tags.local(tags.variableName),
        color: 'var(--syntax-name-variable-local-color)',
      },
      {
        tag: tags.special(tags.variableName),
        color: 'var(--syntax-name-variable-special-color)',
      },
      // headings
      {
        tag: tags.heading,
        color: 'var(--syntax-heading-color)',
        fontWeight: 'var(--syntax-heading-font-weight)',
      },
      {
        tag: tags.heading1,
        color: 'var(--syntax-heading1-color)',
        fontSize: 'var(--syntax-heading1-font-size)',
        fontWeight: 'var(--syntax-heading1-font-weight)',
      },
      {
        tag: tags.heading2,
        color: 'var(--syntax-heading2-color)',
        fontSize: 'var(--syntax-heading2-font-size)',
        fontWeight: 'var(--syntax-heading2-font-weight)',
      },
      {
        tag: tags.heading3,
        color: 'var(--syntax-heading3-color)',
        fontSize: 'var(--syntax-heading3-font-size)',
        fontWeight: 'var(--syntax-heading3-font-weight)',
      },
      {
        tag: tags.heading4,
        color: 'var(--syntax-heading4-color)',
        fontSize: 'var(--syntax-heading4-font-size)',
        fontWeight: 'var(--syntax-heading4-font-weight)',
      },
      {
        tag: tags.heading5,
        color: 'var(--syntax-heading5-color)',
        fontSize: 'var(--syntax-heading5-font-size)',
        fontWeight: 'var(--syntax-heading5-font-weight)',
      },
      {
        tag: tags.heading6,
        color: 'var(--syntax-heading6-color)',
        fontSize: 'var(--syntax-heading6-font-size)',
        fontWeight: 'var(--syntax-heading6-font-weight)',
      },
      // contextual tag types
      {
        tag: tags.keyword,
        color: 'var(--syntax-keyword-color)',
      },
      {
        tag: tags.number,
        color: 'var(--syntax-number-color)',
      },
      {
        tag: tags.operator,
        color: 'var(--syntax-operator-color)',
      },
      {
        tag: tags.punctuation,
        color: 'var(--syntax-punctuation-color)',
      },
      {
        tag: tags.link,
        color: 'var(--syntax-link-color)',
        wordBreak: 'break-all',
      },
      {
        tag: tags.url,
        color: 'var(--syntax-url-color)',
        wordBreak: 'break-all',
      },
      // string group
      {
        tag: tags.string,
        color: 'var(--syntax-string-color)',
      },
      {
        tag: tags.special(tags.string),
        color: 'var(--syntax-string-special-color)',
      },
      // processing instructions
      {
        tag: tags.processingInstruction,
        color: 'var(--syntax-processing-instruction-color)',
      },
    ]),
  )

  return extension;
}



