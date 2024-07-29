import patrickJpg from '../assets/patrick.jpg';

export default function Index() {
	return (
		<Container className="grid gap-4 py-4">
			<div className="grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4">
				<div className="prose col-span-2">
					<p>
						Hello! My name is Patrick Miller. I have been working as a
						full-stack software engineer in Osaka, Japan for several years.
					</p>
					<p>
						I work on web and hybrid mobile applications using Node, Angular,
						Ionic, Electron, React, etc. I also like to develop internal tools
						and systems to help my fellow project members work efficiently.
					</p>
					<p>I have past experience in QA, IT and mechanical engineering.</p>
					<p>
						Here are some various hobby projects that might be interesting. Feel
						free to contact me! Thank you.
					</p>
				</div>
				<div>
					{/* <!-- widths={[400, 800, 1200]} --> */}
					<Image2
						className="rounded-lg"
						src={patrickJpg}
						alt="Picture of Patrick Miller"
						sizes="100vw"
						style={{
							width: '100%',
							height: 'auto',
						}}
					/>
				</div>
			</div>
		</Container>
	);
}
