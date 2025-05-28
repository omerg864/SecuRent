const NavigationTabs = ({
	tabs,
	activeTab,
	onTabChange,
	className = '',
	tabClassName = '',
	activeTabClassName = '',
	inactiveTabClassName = '',
}) => {
	return (
		<div className={` rounded-lg shadow-sm mb-6 ${className}`}>
			<div className="border-b border-gray-200 dark:border-blue-800">
				<nav className="flex space-x-8 px-6">
					{tabs.map(({ id, label, icon: Icon }) => (
						<button
							key={id}
							onClick={() => onTabChange(id)}
							className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
								activeTab === id
									? activeTabClassName || 'border-blue-500 '
									: inactiveTabClassName ||
									  'border-transparent '
							} ${tabClassName}`}
						>
							{Icon && <Icon className="w-4 h-4" />}
							<span>{label}</span>
						</button>
					))}
				</nav>
			</div>
		</div>
	);
};

export default NavigationTabs;
