"use client"

import clsx from "clsx";

/**
   * 
   * @param title string - expect something like "Lorem Ipsum Blah Blah"
   * @param firstLetSize string - Tailwind class for text sizing: sm, m, lg, 2xl, etc
   * @returns JSX.Element - With Title Uppercasing.
   */
export default function TitleUpperCased(title: string, firstClass: string, secondClass: string) {

  const titleArr = title.split(" ");

  const titleDisplay = titleArr.map((word, idx) => {

    return (
      <span key={`title-${word}-${idx}`}>
        <span className={clsx([`${firstClass}`])}>
          {word.toLocaleUpperCase()[0]}
        </span>
        <span>
          {`${word.slice(1).toLocaleUpperCase()} `}
        </span>
      </span>
    )

  })

  return (
    <>
      <span className={clsx([`${secondClass}`])}>{titleDisplay}</span>
    </>
  )

}