import { Fragment } from 'react';

const splitWords = (line) => line.split(' ').filter(Boolean);

const TextSplit = (props) => {
  const { lines, by = 'word', accent = '' } = props;

  return (
    <>
      <span className="visually-hidden">{lines.join(' ')}</span>
      <span className="m-text-split text-split" aria-hidden="true">
        {lines.map((line) => (
          <span className="line" key={line}>
            {splitWords(line).map((word, wordIndex) => {
              const isAccent = word === accent;
              const WordTag = isAccent ? 'em' : 'span';

              return (
                <Fragment key={`${wordIndex}-${word}`}>
                  {wordIndex > 0 && ' '}
                  <WordTag className={isAccent ? 'word accent' : 'word'}>
                    {by === 'char' ? (
                      [...word].map((char, charIndex) => (
                        <span className="char" key={`${charIndex}-${char}`}>
                          {char}
                        </span>
                      ))
                    ) : (
                      <span className="word-inner">{word}</span>
                    )}
                  </WordTag>
                </Fragment>
              );
            })}
          </span>
        ))}
      </span>
    </>
  );
};

export default TextSplit;
